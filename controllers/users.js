const User = require("../models/user")



module.exports.signupForm = async (req, res, next)=>
    {
        res.render("signup.ejs")
    }



module.exports.signupUser = async (req, res)=>
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
    }



module.exports.loginForm = async (req, res, next)=>
    {
        console.log(req.session.originalUrl)
        res.render("login.ejs")
    }



module.exports.loginUser = async (req, res, next)=>
    {
        req.flash("success", "logged in successfully!")

        if(res.locals.url)
        res.redirect(res.locals.url)

        else
        res.redirect("/listings")
    }



module.exports.logoutUser = async (req, res)=>
    {
        req.logout((err)=>
        {
            if (err)
                next(err)

            req.flash("success", "logged out successfully!")
            res.redirect("/listings")
        })
    }