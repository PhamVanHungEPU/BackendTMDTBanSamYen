const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { logoutAdmin } = require('../controllers/Login/logout.controller');
const { registerUser, verifyOtp, resendOtpCode, loginUser, verifyToken, logoutUser, resetPassword } = require('../controllers/Login/login.regisrer.controller');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post('/google', async (req, res) => {
  const { idToken } = req.body;

  try {
    // 1. Verify idToken với Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // 2. Tìm hoặc tạo user
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email: email,
        hoTen: name,
        Image: picture,
        vaiTro: 'hoc_sinh', // default
      });
    } else {
      // Nếu đã có user thì cập nhật lại hoTen, Image nếu cần (optional)
      user.hoTen = name;
      user.Image = picture;
    }

    // 3. Tạo JWT
    const token = jwt.sign(
      { _id: user._id, email: user.email, vaiTro: user.vaiTro },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Lưu user (nếu mới hoặc update)
    await user.save();

    // 5. Trả về token và thông tin user
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        email: user.email,
        hoTen: user.hoTen,
        Image: user.Image,
        vaiTro: user.vaiTro,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: 'Invalid Google token' });
  }
});

router.post("/logout-admin", logoutAdmin );

router.post("/register-user", registerUser );
router.post("/xac-thuc-otp", verifyOtp );
router.post("/resend-otp", resendOtpCode );
router.post("/login-user", loginUser );
router.post("/logout-user", logoutUser );
router.post("/laymk-user", resetPassword );
router.get('/me', verifyToken, (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      user: req.user
    }
  });
});

module.exports = router;
