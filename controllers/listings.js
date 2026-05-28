const Listing = require("../models/listing.js");

// index all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});

  console.log("All listings fetched successfully");
  res.render("listings/index.ejs", { allListings });
};

// new form
module.exports.renderNewForm = (req, res) => {
  //isLogged middleware banaya humne to check if user is logged in or not
  res.render("listings/new.ejs");
};

// show listings in detail
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate({ path: "owner" });
  // {path: "reviews"} --> ek object pass kr rhe hai, jiska param hai path
  // listing ko populate krne ke sath sath author ko bhi populate karenge and vo krne ke liye hume nested populate use krna padega
  // populate reviews field with the actual review documents instead of just their ObjectIds
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

// create listing POST
module.exports.createListingPost = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Set the owner of the listing to the currently logged-in user
  await newListing.save();
  req.flash("success", "Listing created successfully!");
  res.redirect("/listings");
};

// edit listing method
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

// update listing route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, req.body.listing);
  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${id}`);
};

// delete listing route
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log("Deleted listing:", deletedListing);
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
