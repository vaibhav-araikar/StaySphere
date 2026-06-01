const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
// const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "mysupersecretstring",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req, res) => {
  let { name = "Guest" } = req.query;
  req.session.name = name;
  req.flash("success", "You have successfully registered!");
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  res.render("page.ejs", {
    name: req.session.name,
    message: req.flash("success"),
  });
});

// app.get("/test", (req, res) => {
//   res.send("This is a test route!");
// });

// app.get("/reqcount", (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send(`Request count: ${req.session.count}`);
// });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// app.use(cookieParser("secrercode"));
// // secret code for signed cookies and it can be anything like string, number and it will be in unreadable format.It is used to prevent tampering of cookies by malicious users. It is used to ensure that the cookies are not modified by anyone other than the server.

// app.get("/getsignedcookies", (req, res) => {
//   res.cookie("Hello", "World", { signed: true });
//   res.cookie("Origin", "India", { signed: true });
//   res.send("Signed cookies have been set!");
// });

// app.get("/", (req, res) => {
//   res.send("Hello World!");
//   console.dir(req.cookies); // debug
// });
// app.use("/users", users);
// app.use("/posts", posts);
// ///users ye common routes hai jiske andar humne get, post, delete ke routes banaye hai. Jab bhi koi request /users ke sath aayegi toh wo users.js and post.js file ke andar jaake uss route ko handle karega.

// app.get("/getcookies", (req, res) => {
//   res.cookie("Hello", "World");
//   res.cookie("Origin", "India");
//   res.send("Cookies have been set!");
// });

// app.get("/greet", (req, res) => {
//   let { name = "Guest" } = req.cookies;
//   res.send(`Hello, ${name}!`);
// });
