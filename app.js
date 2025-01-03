// const exp = require("constants")
const express = require("express")
const app = express()
const port = 8080
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/error.js")
const wrapAsync = require("./utils/wrapAsync.js")
const cookieParser = require("cookie-parser")

const listings = require("./routes/listings.js")
const reviews = require("./routes/review.js")


// server start
app.listen(port, ()=> {console.log(">>> server activated on", port , ">>>")})

// db connection
async function main() 
{ 
    await mongoose.connect("mongodb://127.0.0.1:27017/nest_share") 
    console.log(">>> db connected >>>")
}
main()


// views
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)
app.use(cookieParser("secretCode"))

// ----------------------------------------------------------------------------------------



// ----------------------------------------------------------------------------------------

app.use("/listings", listings)
app.use("/listings/:id/review", reviews)


// home route
app.get
(   
    "/",
    wrapAsync(async (req, res)=>
    {
        res.cookie("name", "raftaar", {signed: true})
        console.dir(req.signedCookies)
        res.render("home.ejs")
    })
)


// ----------------------------------------------------------------------------------------------------------------------

app.all
(   
    "*", 
    (req, res, next)=>
    {
        const err = new ExpressError(404, "page not found")
        next(err)
    }
)

app.use
(
    (err, req, res, next)=>
    {
        let {status=500, message="error occured"} = err
        console.log(status, message)
        res.status(status).render("error.ejs", {err})
    }
)


