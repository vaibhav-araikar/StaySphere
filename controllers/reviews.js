const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// create review
module.exports.createReview = async (req, res) => {
  console.log(req.body); // debug

  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  // new review ka author store kr rhe hai. and if user logged in hai then new user ka author req.user._id means logged in user banega

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
};

//   delete review route
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  //reviews me se reviewId ko pull kar raha hai, yani remove kar raha hai. Isse listing document ke reviews array se reviewId remove ho jayega. Ye step isliye zaroori hai kyunki jab hum review ko delete karte hain, toh uska reference listing document ke reviews array me reh jata hai. Agar hum $pull operator ka use nahi karenge, toh deleted review ka reference listing document me reh jayega, jo ki galat hoga. $pull operator se hum ensure karte hain ki jab review delete ho jaye, toh uska reference bhi listing document se remove ho jaye.

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
};
