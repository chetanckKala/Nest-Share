const Listing = require("../models/listing.js")
const Review = require("../models/review.js")


module.exports.createReview = async (req, res)=>
{
    const item = await Listing.findById(req.params.id)
    const review = new Review(req.body)
    review.user = req.user._id
    
    item.reviews.push(review)

    await review.save()
    await item.save()

    req.flash("success", "Successfully added a new review!")

    // console.log("<<< review added >>>")
    res.redirect(`/listings/${req.params.id}`)
}



module.exports.deleteReview = async (req, res)=>
{
    const review = await Review.findById(req.params.reviewId).populate("user")
    if (review && !review.user._id.equals(req.user._id))
    {
        req.flash("error", "you don't have access to delete it")
        res.redirect(`/listings/${req.params.id}`)
    }

    else
    {const result = await Listing.findByIdAndUpdate (req.params.id, {$pull: {reviews: req.params.reviewId}})

    if (!result)
    {
        req.flash("error", "Review not found!")
        res.redirect(`/listings/${req.params.id}`)
    }

    else
    {
        await Review.findByIdAndDelete(req.params.reviewId)
        req.flash("success", "Successfully deleted a review!")
        res.redirect( `/listings/${req.params.id}` )
    }}

}