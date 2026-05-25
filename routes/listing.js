const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// humne double dots (.) isliye lagaye kyuki sabhi files ek folder me nahi hai, uun sabki location different different hai, toh humne double dots (..) isliye lagaye kyuki hum ek folder ke andar hai aur uske andar se ek level upar jaake models folder ke andar listing.js file ko access karna hai. Agar humne double dots (..) nahi lagaye toh hum directly listing.js file ko access karne ki koshish karenge jo ki galat hoga kyuki wo file current folder me nahi hai.

// validation middleware for listing and review
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    // error.details is an array of objects, each object has a message property which contains the error message. We are mapping over the array and extracting the message property and joining them with a comma.
    throw new ExpressError(400, errorMessage);
  } else {
    next();
  }
};

// Index Route - Show all listings
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});

    console.log("All listings fetched successfully");
    res.render("listings/index.ejs", { allListings });
  }),
);

// Create new listing route
router.get("/new", isLoggedIn, (req, res) => {
  //isLogged middleware banaya humne to check if user is logged in or not
  res.render("listings/new.ejs");
});

// Show listing route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate("reviews")
      .populate("owner");
    // populate reviews field with the actual review documents instead of just their ObjectIds
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);

// Create listing route (POST) with validation
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user
    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
  }),
);

// Edit listing route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);

// Update listing route
router.put(
  "/:id",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, req.body.listing);

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  }),
);

// Delete listing route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedListing);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  }),
);

module.exports = router;
