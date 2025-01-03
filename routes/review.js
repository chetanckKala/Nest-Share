const express = require("express")
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/error.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing")
const {reviewSchema, listingSchema} = require("../schema.js")




function validateReview (req, res, next)
{
    const {error} = reviewSchema.validate(req.body)

    if (error)
        throw new ExpressError(400, error.details[0].message)

    else
        next()
}

// -------------------------------------------------------------------


// add review
router.post
(
    "/",
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
router.delete
(
    "/:reviewId",
    wrapAsync(async (req, res)=>
    {
        await Listing.findByIdAndUpdate (req.params.id, {$pull: {reviews: req.params.reviewId}})
        const result = await Review.findByIdAndDelete(req.params.reviewId)
        console.log("<<< review deleted >>>")

        res.redirect( `/listings/${req.params.id}` )

    })
)

module.exports = router