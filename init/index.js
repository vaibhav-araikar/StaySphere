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
  await Listing.insertMany(initData.data); //.data = samplListing in data.js file
  console.log("Data was initialized");
};
initDB();
