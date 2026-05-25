const Joi = require("joi");

//========================== Listing validation schema=================================
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string(),
    image: Joi.string().allow("", null),
  }).required(),
});

//============================== Review validation schema==============================
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

// ek listingsSchema banaya hai, jisme listing object ke andar title, description, price, location, country fields hain. title, price, location required hain, description aur country optional hain. Is schema ko use karke hum validate kar sakte hain ki client se aane wala data sahi format mein hai ya nahi. Agar data sahi format mein nahi hai, toh hum error throw kar sakte hain aur client ko bata sakte hain ki kya galat hai.
