const express = require("express")
const router = express.Router()
const Listing = require("../models/listing")
const ExpressError = require("../utils/error.js")
const wrapAsync = require("../utils/wrapAsync.js")
const {listingSchema, reviewSchema} = require("../schema.js")
const flash = require("connect-flash")
const {checkAuth, getUrl} = require("../middleware.js")
const multer = require("multer")
const {storage} = require("../cloudConfig.js")
const upload = multer({storage})

const listingController = require("../controllers/listings.js")



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
    wrapAsync(listingController.index)
)


// create route
router.get
(
    "/new",
    checkAuth,
    wrapAsync(listingController.newForm)
)


// post route
router.post
(
    "/", 
    checkAuth,
    validateListing,
    upload.single("image"),
    wrapAsync(listingController.createListing)
)


// show route
router.get
(
    "/:id", 
    wrapAsync(listingController.showListing)
)



// edit route
router.get
(
    "/:id/edit", 
    checkAuth,
    wrapAsync(listingController.editListing)
)


// update route
router.patch
(
    "/:id", 
    checkAuth,
    validateListing,
    wrapAsync(listingController.updateListing)
)


// delete route
router.delete
(
    "/:id", 
    checkAuth,
    wrapAsync(listingController.deleteListing)
)


// -------------------------------------------------------------------
module.exports = router