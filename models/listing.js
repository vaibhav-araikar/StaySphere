const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
    url: String,
    filename: String,
  },

  price: Number,

  location: String,

  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", //owner user wale schema ko refer karega jo humne user.js file me banaya hai because ek listing ka owner hamare platform pr registered user hi ho sakta hai, toh hum user schema ko reference karenge.
  },
});

// listing schema ke andar ek post mongoose middleware create kr rhe hai and ye findoneanddelete pe kaam karega jisme uus listing ka data ayega jo delete hone wali hai. Agar listing exist karti hai, toh uske reviews ko delete karne ke liye Review model ka use karke deleteMany method call karenge jisme condition hoga ki review ka _id listing ke reviews array me hona chahiye. Isse ensure hoga ki jab koi listing delete ho jaye, toh uske associated reviews bhi delete ho jaye, taki database me orphaned reviews na rahe jinka koi listing se connection na ho.
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
