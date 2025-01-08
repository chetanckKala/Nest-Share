const Listing = require("../models/listing.js")



module.exports.index = async (req, res)=>
{
    // console.log(req.user)
    const result = await Listing.find({})
    res.render("listing.ejs", {result})
}



module.exports.newForm = async (req, res)=> {
     res.render("new.ejs") }



module.exports.createListing = async (req, res, next)=>
{
    const item = new Listing(req.body)
    item.owner = req.user

    // console.log(req.file)

    if (req.file)
    {
        const url = req.file.path
        const filename = req.file.filename

        item.image = {url, filename}
    }
    
    await item.save()

    req.flash("success", "Successfully added a new listing!")
    res.redirect("/listings")
}



module.exports.showListing = async (req, res)=>
{
    const item = await Listing.findById(req.params.id)
                .populate
                ({
                    path: "reviews",
                    populate: {path: "user"},
                })
                .populate("owner")
    

    if (!item)
    {
        req.flash("error", "Listing not found!")
        res.redirect("/listings")
    }

    else
    {
        // console.log(req.user._id)
        // console.log(item.owner._id)
        res.render("show.ejs", {item})
    }   
}



module.exports.editListing = async (req, res)=>
{
    const item = await Listing.findById(req.params.id).populate("owner")

    if (!item)
    {
        req.flash("error", "Listing not found!")
        res.redirect("/listings")
    }

    else if (req.user._id.equals(item.owner._id))
    {
        let originalUrl = item.image.url
        let modifiedUrl = originalUrl.replace("/upload", "/upload")

        console.log(originalUrl)

        res.render("edit.ejs", {item, modifiedUrl})
    }

    else
    {
        req.flash("error", "You don't have access to edit this!")
        res.redirect(`/listings/${req.params.id}`)
    }
}



module.exports.updateListing = async (req, res, next)=>
{
    const item = await Listing.findById(req.params.id).populate("owner")

    if (!req.user._id.equals(item.owner._id))
    {
        req.flash("error", "You don't have access to edit this!")
        res.redirect(`/listings/${req.params.id}`)
    }

    await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

    if ( req.file)
    {
        const url = req.file.path
        const filename = req.file.filename
        await Listing.findByIdAndUpdate(req.params.id, {image: {url, filename}})
    }

    // else
    //     await Listing.findByIdAndUpdate(req.params.id, {image: {url: req.body.image.url}})

    
    req.flash("success", "Successfully updated the listing!")
    res.redirect(`/listings/${item._id}`)
}



module.exports.deleteListing = async (req, res, next)=>
{
    const item = await Listing.findById(req.params.id).populate("owner")
    
    if (!item)
    {
        req.flash("error", "Listing not found!")
        res.redirect("/listings")
    }
    
    else if (req.user._id.equals(item.owner._id))
    {
        await Listing.findByIdAndDelete(req.params.id)
        req.flash("success", "Successfully deleted a listing!")
        res.redirect("/listings")
    }

    else
    {
        req.flash("error", "You don't have access to delete this!")
        res.redirect(`/listings/${req.params.id}`)
    }
    
    
}