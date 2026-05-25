const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");
// listings = common name for all routes which we are using from routes folder and it helps to not get bloated code
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// success and error ye humne laaye hai from connect-flash package se, jisse hum flash messages ko display kar sakte hain. Flash messages temporary messages hote hain jo ek request ke baad dusre request me dikhaye jate hain. Jab bhi hum req.flash("success", "Your message here") ya req.flash("error", "Your message here") use karte hain, toh ye messages success aur error variables me store ho jate hain, jise hum app.use((req, res, next) => { ... }) middleware me set karte hain, jisse ye variables har ek route me available ho jate hain. Isse hum apne views me in messages ko display kar sakte hain, jaise ki flash.ejs file me kiya gaya hai.
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// getting routes from from routes folder and using them in app.js file, jisse code clean rahega aur modular rahega. Agar humne routes ko alag file me nahi rakha hota, toh app.js file bahut badi ho jati aur usme sabhi routes ka code hota, jo ki maintain karna mushkil ho jata. Ab humne routes ko alag file me rakha hai, toh app.js file me sirf un routes ko import karke use karna hai, jisse code clean aur organized rahega.
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.get("/", (req, res) => {
  res.send("Working fine");
});

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

app.get("/demouser", async (req, res) => {
  let fakeUser = new User({
    email: "vaibhav@gmail.com",
    username: "vaibhav",
  });
  let registeredUser = await User.register(fakeUser, "password123");
  res.send(registeredUser);
});

//   Test listing route
app.get(
  "/testListing",
  wrapAsync(async (req, res) => {
    try {
      let sampleListing = new Listing({
        title: "Beautiful Beach House",
        description: "A lovely beach house with stunning ocean views.",
        image: "",
        price: 250,
        location: "Santa Monica, CA",
        country: "USA",
      });

      await sampleListing.save();

      console.log("Sample saved");

      res.send("Sample listing saved successfully!");
    } catch (err) {
      console.error("Error saving sample listing:", err);
      res.send("Error occurred");
    }
  }),
);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  // result ko status code ke sath bhej raha hai, jisse client ko pata chale ki kya error hua hai
  res.status(statusCode).render("error.ejs", { err });
});
