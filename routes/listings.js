const express = require("express")
const router = express.Router()
const Listing = require("../models/listing")
const ExpressError = require("../utils/error.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const flash = require("connect-flash")
const {checkAuth, getUrl} = require("../middleware.js")



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
        // console.log(req.user)
        const result = await Listing.find({})
        res.render("listing.ejs", {result})
    })
)


// create route
router.get
(
    "/new",
    checkAuth,
    async (req, res)=>
    {
        
        res.render("new.ejs")

    }
)


// post route
router.post
(
    "/", 
    checkAuth,
    validateListing,
    wrapAsync(async (req, res, next)=>
    {
        const item = new Listing(req.body)
        item.owner = req.user
        await item.save()

        req.flash("success", "Successfully added a new listing!")
        res.redirect("/listings")
    })
)


// show route
router.get
(
    "/:id", 
    wrapAsync(async (req, res)=>
    {
        const item = await Listing.findById(req.params.id)
                                            .populate
                                            ({
                                                path: "reviews",
                                                populate: {path: "user"},
                                            })
                                            .populate("owner")
        

        if (!item)
        {
            req.flash("error", "Listing not found!")
            res.redirect("/listings")
        }

        else
        {
            // console.log(req.user._id)
            // console.log(item.owner._id)
            res.render("show.ejs", {item})
        }

            
    })
)



// edit route
router.get
(
    "/:id/edit", 
    checkAuth,
    wrapAsync(async (req, res)=>
    {
        const item = await Listing.findById(req.params.id).populate("owner")

        if (!item)
        {
            req.flash("error", "Listing not found!")
            res.redirect("/listings")
        }

        else if (req.user._id.equals(item.owner._id))
            res.render("edit.ejs", {item})

        else
        {
            req.flash("error", "You don't have access to edit this!")
            res.redirect(`/listings/${req.params.id}`)
        }
    })
)


// update route
router.patch
(
    "/:id", 
    checkAuth,
    validateListing,
    wrapAsync(async (req, res, next)=>
    {
        const item = await Listing.findById(req.params.id).populate("owner")

        if (!req.user._id.equals(item.owner._id))
        {
            req.flash("error", "You don't have access to edit this!")
            res.redirect(`/listings/${req.params.id}`)
        }

        await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        req.flash("success", "Successfully updated the listing!")
        res.redirect(`/listings/${item._id}`)
    })
)


// delete route
router.delete
(
    "/:id", 
    checkAuth,
    wrapAsync(async (req, res, next)=>
    {
        const item = await Listing.findById(req.params.id).populate("owner")
        
        if (!item)
        {
            req.flash("error", "Listing not found!")
            res.redirect("/listings")
        }
        
        else if (req.user._id.equals(item.owner._id))
        {
            await Listing.findByIdAndDelete(req.params.id)
            req.flash("success", "Successfully deleted a listing!")
            res.redirect("/listings")
        }

        else
        {
            req.flash("error", "You don't have access to delete this!")
            res.redirect(`/listings/${req.params.id}`)
        }
        
        
    })
)


// -------------------------------------------------------------------
module.exports = router