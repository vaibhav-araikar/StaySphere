const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

// MongoDB connection
const MONGO_URL = "mongodb://localhost:27017/airbnb";
async function main() {
  await mongoose.connect(MONGO_URL);
  //   console.log("Connected to MongoDB");
}
main()
  .then(() => {
    console.log("MongoDB connection established successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6a133a46d53bf82c77325d1c",
  }));
  // we are adding owner field to each listing object in the data array and assigning it a value of "64b8c9e5f1a4c0d1a2b3c4d" which is the ObjectId of the user who will be the owner of all the listings in our database. This is necessary because in our listing schema, we have defined an owner field which is a reference to the User model, and it is required for each listing to have an owner. By adding this field to each listing object in our data array, we can ensure that when we insert the listings into our database, they will have a valid owner reference.
  await Listing.insertMany(initData.data); //.data = samplListing in data.js file
  console.log("Data was initialized");
};
initDB();
