const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { validateListing } = require("../middleware.js");
const { isLoggedIn } = require("../middleware.js");
const { isOwner } = require("../middleware.js");

// humne double dots (.) isliye lagaye kyuki sabhi files ek folder me nahi hai, uun sabki location different different hai, toh humne double dots (..) isliye lagaye kyuki hum ek folder ke andar hai aur uske andar se ek level upar jaake models folder ke andar listing.js file ko access karna hai. Agar humne double dots (..) nahi lagaye toh hum directly listing.js file ko access karne ki koshish karenge jo ki galat hoga kyuki wo file current folder me nahi hai.

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
  isOwner,
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
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  }),
);

// isOwner is a middleware to check if the current user is the owner or not to edit the listing
// isLoggedIn is a middleware to check if the user is logged in or not to edit the listing, kyuki agar user login nahi hai toh wo listing ko edit nahi kar sakta, toh pehle hum check karenge ki user login hai ya nahi, agar login hai toh phir hum check karenge ki wo listing ka owner hai ya nahi, agar wo listing ka owner hai toh hi wo listing ko edit kar sakta hai, agar wo listing ka owner nahi hai toh usko error message show karenge ki "You do not have permission to edit this listing!" aur usko wapas listing ke show page par redirect kar denge.
// And all the above middlewares are stored in middleware.js file, toh humne unko import karke use kiya hai is listing.js file me, jisse hum apne routes me unko use kar sake and code ko clean and organized rakh sake.

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
