const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// // signup get request
// router.get("/signup", (req, res) => {
//   res.render("users/signup");
// });
// used router.route for get signup

// // signup post request
// router.post("/signup", wrapAsync(userController.signUp));
// used router.route for post signup

// using router.route
router
  .route("/signup")
  .get((req, res) => {
    res.render("users/signup");
  })
  .post(wrapAsync(userController.signUp));

// async request because database me hum change kar rahe hai, toh hume wait karna padega jab tak database me change nahi hota, tab tak hum next line of code pe nahi ja sakte, isliye async request banayi hai.

// login get request
// router.get("/login", (req, res) => {
//   res.render("users/login");
// });
// login get router modified using router.route

// //login post request
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.login,
// );
// login post router modified using router.route
// we create saveRedirectUrl middleware to save the redirect url in the session and is saved in middleware.js file

// login route using router.route
router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );

// logout
router.get("/logout", userController.logout);

module.exports = router;

// failureFlash: true ka matlab hai ki agar login me koi error aata hai, toh us error message ko flash message ke through user ko dikhaya jayega. Agar login successful hota hai, toh success flash message dikhaya jayega.

// passport.authenticate("local", { ... }) middleware ko humne router.post("/login", ...) me use kiya hai, jisse jab bhi koi user login karne ki koshish karega, toh passport uske credentials ko verify karega. Agar credentials sahi hote hain, toh user ko login kar diya jayega aur success flash message dikhaya jayega. Agar credentials galat hote hain, toh user ko login page par wapas bhej diya jayega aur failure flash message dikhaya jayega.
// and vo automatically user ki login info check karega, agar sahi hai toh user ko login kar dega, aur agar galat hai toh user ko login page par wapas bhej dega. Iske liye hume manually code likhne ki zarurat nahi hai, passport.authenticate middleware ye sab kuch handle kar leta hai.

// req.login = jab bhi hum sign up karenge to vo automatically user ko login kar dega, aur
// req.logout = jab bhi hum logout karenge to vo automatically user ko logout kar dega. Iske liye hume manually code likhne ki zarurat nahi hai, passport ye sab kuch handle kar leta hai.

// // common mistake (Important mistakes)
// req.locals
// but it should be
// res.locals

// user login and logout routes without MVC for better understanding
// // sign up post
// router.post(
//   "/signup",
//   wrapAsync(async (req, res) => {
//     try {
//       const { username, email, password } = req.body;
//       const newUser = new User({ username, email });
//       const registeredUser = await User.register(newUser, password);
//       console.log(registeredUser);
//       req.login(registeredUser, (err) => {
//         if (err) {
//           return next(err);
//         }
//         req.flash("success", "Welcome to Airbnb!");
//         res.redirect("/listings");
//       });
//     } catch (err) {
//       req.flash("error", err.message);
//       res.redirect("/signup");
//     }
//   }),
// );

// // user login
// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   async (req, res) => {
//     req.flash("success", "Welcome back!");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
//   },
// );

// // user logout
// router.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     req.flash("success", "You have been logged out!");
//     res.redirect("/listings");
//   });
// });
