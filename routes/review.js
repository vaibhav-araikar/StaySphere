const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Review routes  --> post request to create a new review for a listing

// validation middleware for review
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

// Create review route
router.post(
  "/",
  //listings/:id/reviews = /
  validateReview,
  wrapAsync(async (req, res) => {
    console.log(req.body); // debug

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review added successfully!");
    res.redirect(`/listings/${listing._id}`);
  }),
);

// Delete review route
router.delete("/:reviewId", async (req, res) => {
  let { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  //reviews me se reviewId ko pull kar raha hai, yani remove kar raha hai. Isse listing document ke reviews array se reviewId remove ho jayega. Ye step isliye zaroori hai kyunki jab hum review ko delete karte hain, toh uska reference listing document ke reviews array me reh jata hai. Agar hum $pull operator ka use nahi karenge, toh deleted review ka reference listing document me reh jayega, jo ki galat hoga. $pull operator se hum ensure karte hain ki jab review delete ho jaye, toh uska reference bhi listing document se remove ho jaye.

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/listings/${id}`);
});

module.exports = router;
