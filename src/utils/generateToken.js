const jwt = require("jsonwebtoken");

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user._id, vaiTro: user.vaiTro },
    process.env.JWT_ACCESS_SECRET || "secret_key_here",
    { expiresIn: "7d" }
  );
};
