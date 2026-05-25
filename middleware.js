module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// jab login pr click karenge tab session id reset ho jaati hai, to hum session id ko locals me store kar rahe hai, jisse hum login hone ke baad user ko us page par redirect kar sake jahan se wo login karne ki koshish kar raha tha. Agar session id reset nahi hoti, toh user login hone ke baad hamesha home page par redirect ho jata, chahe wo kisi bhi page se login karne ki koshish kar raha ho. Ab hum session id ko locals me store kar rahe hai, jisse login hone ke baad user us page par redirect ho jayega jahan se wo login karne ki koshish kar raha tha.

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
