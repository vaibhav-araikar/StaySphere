const express = require("express");
const router = express.Router();

// Index route for users
router.get("/", (req, res) => {
  res.send("GET for Users");
});

// Show route for a specific user
router.get("/:id", (req, res) => {
  res.send(`GET for User with id ${req.params.id}`);
});

// POST route to create a new user
router.post("/", (req, res) => {
  res.send("POST for Users");
});

// DELETE route to delete a specific user
router.delete("/:id", (req, res) => {
  res.send(`DELETE for User with id ${req.params.id}`);
});

module.exports = router;
