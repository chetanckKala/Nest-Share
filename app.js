const exp = require("constants")
const express = require("express")
const app = express()
const port = 8080
const mongoose = require("mongoose")
const path = require("path")
const methodOverride = require("method-override")
const Listing = require("./models/listing")
const ejsMate = require("ejs-mate")


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



// ----------------------------------------------------------------------------------------


// home route
app.get("/", async (req, res)=>
{
    res.render("home.ejs")
})


// listings route
app.get("/listings", async (req, res)=>
{
    const result = await Listing.find({})
    res.render("listing.ejs", {result})
})


// create route
app.get("/listings/new", (req, res)=>
{
    res.render("new.ejs")
})


// post route
app.post("/listings", async (req, res)=>
{
    const item = new Listing(req.body)
    await item.save()
    res.redirect("/listings")
})


// show route
app.get("/listings/:id", async (req, res)=>
{
    const item = await Listing.findById(req.params.id)
    res.render("show.ejs", {item})
})


// edit route
app.get("/listings/:id/edit", async (req, res)=>
{
    const item = await Listing.findById(req.params.id)
    res.render("edit.ejs", {item})
    // res.send("hi")
})


// update route
app.patch("/listings/:id", async (req, res)=>
{
    const item = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true})
    res.redirect(`/listings/${item._id}`)
    // res.send("working")
})


// delete route
app.delete("/listings/:id", async (req, res)=>
{
    const item = await Listing.findByIdAndDelete(req.params.id)
    res.redirect("/listings")
    // res.send("working")
})


