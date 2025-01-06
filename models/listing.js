const mongoose = require("mongoose")
const Review = require("./review.js")

async function main() { await mongoose.connect("mongodb://127.0.0.1:27017/nest_share") }
main().then(()=> {console.log(">>> mongodb connection established >>>")}).catch((err)=> {console.log(">>> mongodb connection failed <<<")})

// ------------------------------------------------------------------------------------------------------------------------------------------------

const listingSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        location: { type: String, required: true },
        country: { type: String, required: true },
        image: 
        { 
            type: String,  
            default: "https://cdn.dribbble.com/users/5951/screenshots/2331225/media/6fbab269ece7956a2df807166e70d4e3.png?resize=768x576&vertical=center",
            set: (v)=> 
            {
                if (v==="")
                    return "https://cdn.dribbble.com/users/5951/screenshots/2331225/media/6fbab269ece7956a2df807166e70d4e3.png?resize=768x576&vertical=center"
                else
                    return v
            }
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review"
            }
        ],
        owner:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

listingSchema.post ("findOneAndDelete", async (item)=>
{
    console.log("post landed")
    if (item.reviews.length > 0)
    {
        const result = await Review.deleteMany ({_id : {$in: item.reviews}})
        console.log(result);
    }
})

const Listing = mongoose.model("Listing", listingSchema)
module.exports = Listing