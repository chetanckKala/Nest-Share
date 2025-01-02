const exp = require("constants")
const express = require("express")
const app = express()
const port = 8080
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const Listing = require("./models/listing")
const Review = require("./models/review.js")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/error.js")
const wrapAsync = require("./utils/wrapAsync.js")
const {listingSchema, reviewSchema} = require("./schema.js")
// const {reviewSchema} = require("./schema.js")
const { func } = require("joi")


// server start
app.listen(port, ()=> {console.log(">>> server activated on", port , ">>>")})

// db connection
async function main() 
{ 
    await mongoose.connect("mongodb://127.0.0.1:27017/nest_share") 
    console.log(">>> db connected >>>")
}
main()


// views
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)


// ----------------------------------------------------------------------------------------
function validateListing (req, res, next)
{
    const { error } = listingSchema.validate(req.body)
    if (error)
        throw new ExpressError(400, error.details[0].message)

    else
        next()
}

function validateReview (req, res, next)
{
    const {error} = reviewSchema.validate(req.body)

    if (error)
        throw new ExpressError(400, error.details[0].message)

    else
        next()
}


// ----------------------------------------------------------------------------------------


// home route
app.get
(   
    "/",
    wrapAsync(async (req, res)=>
    {
        res.render("home.ejs")
    })
)


// listings route
app.get
( 
    "/listings",
    wrapAsync(async (req, res)=>
    {
        const result = await Listing.find({})
        res.render("listing.ejs", {result})
    })
)


// create route
app.get
(
    "/listings/new",
    (req, res)=>
    {
        res.render("new.ejs")
    }
)


// post route
app.post
(
    "/listings", 
    validateListing,
    wrapAsync(async (req, res, next)=>
    {
        const item = new Listing(req.body)
        await item.save()
        res.redirect("/listings")
    })
)


// show route
app.get
(
    "/listings/:id", 
    wrapAsync(async (req, res)=>
    {
        const item = await Listing.findById(req.params.id).populate("reviews")
        res.render("show.ejs", {item})
    })
)



// edit route
app.get
(
    "/listings/:id/edit", 
    wrapAsync(async (req, res)=>
    {
        const item = await Listing.findById(req.params.id)
        res.render("edit.ejs", {item})
        // res.send("hi")
    })
)


// update route
app.patch
(
    "/listings/:id", 
    validateListing,
    wrapAsync(async (req, res, next)=>
    {
        const item = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        res.redirect(`/listings/${item._id}`)
    })
)


// delete route
app.delete
(
    "/listings/:id", 
    wrapAsync(async (req, res, next)=>
    {
        const item = await Listing.findByIdAndDelete(req.params.id)
        res.redirect("/listings")
        // res.send("working")
    })
)


// add review
app.post
(
    "/listings/:id/review",
    validateReview,
    wrapAsync (async (req, res)=>
    {
        const item = await Listing.findById(req.params.id)
        const review = new Review(req.body)
        item.reviews.push(review)

        await review.save()
        await item.save()

        console.log("<<< review added >>>")
        res.redirect(`/listings/${req.params.id}`)
    })
)


// delete review
app.delete
(
    "/listings/:id/review/:reviewId",
    wrapAsync(async (req, res)=>
    {
        await Listing.findByIdAndUpdate (req.params.id, {$pull: {reviews: req.params.reviewId}})
        const result = await Review.findByIdAndDelete(req.params.reviewId)
        console.log("<<< review deleted >>>")

        res.redirect( `/listings/${req.params.id}` )

    })
)

// ----------------------------------------------------------------------------------------------------------------------

app.all
(   
    "*", 
    (req, res, next)=>
    {
        const err = new ExpressError(404, "page not found")
        next(err)
    }
)

app.use
(
    (err, req, res, next)=>
    {
        let {status=500, message="error occured"} = err
        console.log(status, message)
        res.status(status).render("error.ejs", {err})
    }
)


