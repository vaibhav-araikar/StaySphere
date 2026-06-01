const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);
// This plugin will add username and password fields to our user schema and also add some methods for authentication.

module.exports = mongoose.model("User", userSchema);
