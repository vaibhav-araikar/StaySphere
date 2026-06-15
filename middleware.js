const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js");
const { reviewSchema, listingSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// jab login pr click karenge tab session id reset ho jaati hai, to hum session id ko locals me store kar rahe hai, jisse hum login hone ke baad user ko us page par redirect kar sake jahan se wo login karne ki koshish kar raha tha. Agar session id reset nahi hoti, toh user login hone ke baad hamesha home page par redirect ho jata, chahe wo kisi bhi page se login karne ki koshish kar raha ho. Ab hum session id ko locals me store kar rahe hai, jisse login hone ke baad user us page par redirect ho jayega jahan se wo login karne ki koshish kar raha tha.

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  // check if the current user is the owner of the listing before allowing them to update it
  if (!listing.owner.equals(res.locals.currentUser._id)) {
    req.flash("error", "You do not have permission to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// validation middleware for listing and review
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    // error.details is an array of objects, each object has a message property which contains the error message. We are mapping over the array and extracting the message property and joining them with a comma.
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

// validation middleware for review
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

// to check if the current logged in user is author or not to delete the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listing/${id}`);
  }
  next();
};
