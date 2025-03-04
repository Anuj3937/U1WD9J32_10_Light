const express = require("express");
const {
  authTherapist,
  registerTherapist,
  logoutTherapist,
  getTherapistProfile,
  updateTherapistProfile,
} = require("../controllers/therapistController.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/", registerTherapist);
router.post("/auth", authTherapist);
router.post("/logout", logoutTherapist);
router
  .route("/profile")
  .get(protect, getTherapistProfile)
  .put(protect, updateTherapistProfile);

module.exports = router;
