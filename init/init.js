const mongoose = require("mongoose")
const {data} = require("./data.js")
const Listing = require("../models/listing.js")

async function main() { await mongoose.connect("mongodb://127.0.0.1:27017/nest_share") }
main().then(()=> {console.log(">>> mongodb connection established >>>")}).catch((err)=> {console.log(">>> mongodb connection failed <<<")})

for (let d of data)
{
    const listing1 = new Listing
    (
        {
            title: d.title,
            description: d.description,
            price: d.price,
            location: d.location,
            country: d.country,
            image: d.image.url
        }
    )

    listing1.save()
        .then( (result)=> {console.log(result)} )
        .catch((err)=> {console.log(err)})
}