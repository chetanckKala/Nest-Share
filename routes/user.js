const express = require("express")
const wrapAsync = require("../utils/wrapAsync")
const router = express.Router({mergeParams: true})
const User = require("../models/user.js")
const passport = require("passport")
const {getUrl} = require("../middleware.js")


// get signup
router.get
(
    "/signup",
    wrapAsync(async (req, res, next)=>
    {
        res.render("signup.ejs")
    })
)


// post signup
router.post
(
    "/signup",
    wrapAsync(async (req, res)=>
    {
        // console.log("ok")
        const {username, email, pswd} = req.body
        
        const user = new User({
            username: username,
            email: email,
        })

        const result = await User.register (user, pswd)

        req.login(result, (err)=>
        {
            if (err)
                next(err)

            else
            {
                req.flash("success", "Welcome to Nestshare!")
                res.redirect("/listings")
            }

        })
    })
)


// get login
router.get
(
    "/login",
    wrapAsync(async (req, res, next)=>
    {
        console.log(req.session.originalUrl)
        res.render("login.ejs")
    })
)


// post login
router.post
(
    "/login",
    getUrl,
    passport.authenticate("local", {failureRedirect: "/users/login", failureFlash: true}),
    wrapAsync(async (req, res, next)=>
    {
        req.flash("success", "logged in successfully!")

        if(res.locals.url)
        res.redirect(res.locals.url)

        else
        res.redirect("/listings")
    })
)


// get logout
router.get
(
    "/logout",
    wrapAsync(async (req, res)=>
    {
        req.logout((err)=>
        {
            if (err)
                next(err)

            req.flash("success", "logged out successfully!")
            res.redirect("/listings")
        })
    })
)


module.exports = router