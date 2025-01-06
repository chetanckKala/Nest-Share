function checkAuth (req, res, next)
{

    if (!req.isAuthenticated())
    {
        if (req.method != "DELETE")
            req.session.originalUrl = req.originalUrl
    
        req.flash("error", "You are not logged in")
        return res.redirect("/users/login")
    }

    else
        next()
}

function getUrl (req, res, next)
{
    res.locals.url = req.session.originalUrl
    console.log(res.locals.url)
    next()
}

module.exports = {checkAuth, getUrl}