const express = require("express")
const router = express.Router({mergeParams: true})
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/error.js")
const Review = require("../models/review.js")
const Listing = require("../models/listing")
const {reviewSchema, listingSchema} = require("../schema.js")
const { checkAuth } = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")




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
    checkAuth,
    validateReview,
    wrapAsync (reviewController.createReview)
)


// delete review
router.delete
(
    "/:reviewId",
    checkAuth,
    wrapAsync(reviewController.deleteReview)
)

module.exports = router