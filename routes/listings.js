const express = require("express")
const router = express.Router()
const Listing = require("../models/listing")
const ExpressError = require("../utils/error.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema, reviewSchema} = require("../schema.js")



// validate schema
function validateListing (req, res, next)
{
    const { error } = listingSchema.validate(req.body)
    if (error)
        throw new ExpressError(400, error.details[0].message)

    else
        next()
}

// --------------------------------------------------------------



// listings route
router.get
( 
    "/",
    wrapAsync(async (req, res)=>
    {
        const result = await Listing.find({})
        res.render("listing.ejs", {result})
    })
)


// create route
router.get
(
    "/new",
    (req, res)=>
    {
        res.render("new.ejs")
    }
)


// post route
router.post
(
    "/", 
    validateListing,
    wrapAsync(async (req, res, next)=>
    {
        const item = new Listing(req.body)
        await item.save()
        res.redirect("/listings")
    })
)


// show route
router.get
(
    "/:id", 
    wrapAsync(async (req, res)=>
    {
        const item = await Listing.findById(req.params.id).populate("reviews")
        res.render("show.ejs", {item})
    })
)



// edit route
router.get
(
    "/:id/edit", 
    wrapAsync(async (req, res)=>
    {
        const item = await Listing.findById(req.params.id)
        res.render("edit.ejs", {item})
        // res.send("hi")
    })
)


// update route
router.patch
(
    "/:id", 
    validateListing,
    wrapAsync(async (req, res, next)=>
    {
        const item = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        res.redirect(`/listings/${item._id}`)
    })
)


// delete route
router.delete
(
    "/:id", 
    wrapAsync(async (req, res, next)=>
    {
        const item = await Listing.findByIdAndDelete(req.params.id)
        res.redirect("/listings")
        // res.send("working")
    })
)


// -------------------------------------------------------------------
module.exports = router