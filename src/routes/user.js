const express = require("express");
const { getAllUser, getAllUserWithStats, getUserById, updateUserInfo, changePassword } = require("../controllers/User/user.controller");

const router = express.Router();

router.get("/get-byid-user", getUserById);
router.put("/update-user", updateUserInfo);
router.post("/change-password", changePassword);

module.exports = router;