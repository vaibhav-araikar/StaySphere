const express = require("express");
const router = express.Router();

// index
router.get("/", (req, res) => {
  res.send("GET for Posts");
});

// show
router.get("/:id", (req, res) => {
  res.send(`GET for Post with id ${req.params.id}`);
});

// POST
router.post("/", (req, res) => {
  res.send("POST for Posts");
});

// DELETE
router.delete("/:id", (req, res) => {
  res.send(`DELETE for Post with id ${req.params.id}`);
});

module.exports = router;

// common part /post ye common routes hai jiske andar humne get, post, delete ke routes banaye hai. Jab bhi koi request /posts ke sath aayegi toh wo users.js and post.js file ke andar jaake uss route ko handle karega.
// and humne server.js file me app.use("/posts", posts); likha hai jisse jab bhi koi request /posts ke sath aayegi toh wo post.js file ke andar jaake uss route ko handle karega. aur oose humne nikaal liya hai
