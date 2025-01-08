const express = require("express")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router({mergeParams: true})
const User = require("../models/user.js")
const passport = require("passport")
const {getUrl} = require("../middleware.js")
const userController = require("../controllers/users.js")


// get signup
router.get
(
    "/signup",
    wrapAsync(userController.signupForm)
)


// post signup
router.post
(
    "/signup",
    wrapAsync(userController.signupUser)
)


// get login
router.get
(
    "/login",
    wrapAsync(userController.loginForm)
)


// post login
router.post
(
    "/login",
    getUrl,
    passport.authenticate("local", {failureRedirect: "/users/login", failureFlash: true}),
    wrapAsync(userController.loginUser)
)


// get logout
router.get
(
    "/logout",
    wrapAsync(userController.logoutUser)
)


module.exports = router