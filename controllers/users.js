const User = require("../models/user");
const crypto = require("crypto");
const transporter = require("../utils/mailer");

// signup
module.exports.signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({
      username,
      email,
    });

    const registeredUser = await User.register(newUser, password);

    // verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    registeredUser.verificationToken = verificationToken;

    await registeredUser.save();

    // verification email link
    const verifyLink = `${req.protocol}://${req.get("host")}/verify-account/${verificationToken}`;

    // send verification mail
    await transporter.sendMail({
      from: `"StaySphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your StaySphere Account",

      html: `
        <h2>Welcome to StaySphere!</h2>

        <p>Thank you for creating an account.</p>

        <p>Please verify your email address.</p>

        <p>
          <a
            href="${verifyLink}"
            style="
              background:#222;
              color:white;
              padding:10px 18px;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Verify Account
          </a>
        </p>
      `,
    });

    req.flash(
      "success",
      "Verification email sent. Please verify your account before login.",
    );

    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

// forgot password
module.exports.sendResetLink = async (req, res) => {
  try {
    const { email } = req.body;

    console.log("Forgot password route hit");
    console.log("Email:", email);

    const user = await User.findOne({ email });

    console.log("User found:", !!user);

    if (!user) {
      req.flash("error", "No account found with that email.");
      return res.redirect("/forgot-password");
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink = `${req.protocol}://${req.get(
      "host",
    )}/reset-password/${token}`;

    console.log("Reset Link:", resetLink);

    await transporter.sendMail({
      from: `"StaySphere" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "StaySphere Password Reset",
      html: `
        <h2>Password Reset Request</h2>

        <p>Hello,</p>

        <p>You requested a password reset for your StaySphere account.</p>

        <p>
          Click the button below to reset your password:
        </p>

        <p>
          <a
            href="${resetLink}"
            style="
              background:#222;
              color:white;
              padding:10px 18px;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Reset Password
          </a>
        </p>

        <p>This link will expire in 15 minutes.</p>

        <p>If you did not request this reset, please ignore this email.</p>
      `,
    });

    console.log("Password reset email sent successfully");

    req.flash(
      "success",
      "Password reset link sent successfully. Please check your email.",
    );

    res.redirect("/login");
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);

    req.flash("error", "Unable to send password reset email.");

    res.redirect("/forgot-password");
  }
};

// reset password form
module.exports.showResetForm = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    req.flash("error", "Password reset link is invalid or expired.");
    return res.redirect("/forgot-password");
  }

  res.render("users/reset-password", { token });
};

// reset password
module.exports.resetPassword = async (req, res) => {
  try {
    console.log("RESET PASSWORD ROUTE HIT");

    const { token } = req.params;
    const { password } = req.body;

    console.log("TOKEN:", token);
    console.log("PASSWORD:", password);

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    console.log("USER FOUND:", !!user);

    if (!user) {
      req.flash("error", "Password reset link is invalid or expired.");
      return res.redirect("/forgot-password");
    }

    await user.setPassword(password);
    console.log("PASSWORD HASH UPDATED");

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    const authResult = await User.authenticate()(user.username, password);

    console.log(authResult);
    console.log("AUTHENTICATION TEST:", authResult);
    const updatedUser = await User.findById(user._id);
    console.log("UPDATED USER:");
    console.dir(updatedUser.toObject(), { depth: null });
    console.log("USER SAVED SUCCESSFULLY");

    req.flash("success", "Password updated successfully.");
    res.redirect("/login");
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
  }
};

// login
// login
module.exports.login = async (req, res, next) => {
  if (!req.user.isVerified) {
    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    req.user.verificationToken = verificationToken;

    await req.user.save();

    // Verification link
    const verifyLink = `${req.protocol}://${req.get(
      "host",
    )}/verify-account/${verificationToken}`;

    // Send verification email
    await transporter.sendMail({
      from: `"StaySphere" <${process.env.EMAIL_USER}>`,
      to: req.user.email,
      subject: "Verify Your StaySphere Account",

      html: `
        <h2>Verify Your Email</h2>

        <p>Your account is not verified yet.</p>

        <p>Please click the button below to verify your account.</p>

        <p>
          <a
            href="${verifyLink}"
            style="
              background:#222;
              color:white;
              padding:10px 18px;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Verify Account
          </a>
        </p>
      `,
    });

    req.logout((err) => {
      if (err) return next(err);
    });

    req.flash(
      "error",
      "Your account is not verified. A new verification email has been sent to your registered email address.",
    );

    return res.redirect("/login");
  }

  req.flash("success", "Welcome back!");

  let redirectUrl = res.locals.redirectUrl || "/listings";

  res.redirect(redirectUrl);
};

// logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.flash("success", "You have been logged out!");

    res.redirect("/listings");
  });
};

// verify account
module.exports.verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      req.flash("error", "Invalid verification link.");
      return res.redirect("/login");
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    req.flash("success", "Email verified successfully. Please login.");

    res.redirect("/login");
  } catch (err) {
    console.error("VERIFY ACCOUNT ERROR:", err);

    req.flash("error", "Verification failed.");

    res.redirect("/login");
  }
};
