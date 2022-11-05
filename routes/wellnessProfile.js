const express = require("express");

const wellnessProfileController = require("../controllers/wellnessProfile");

const router = express.Router();

// /profile/add => POST
router.post("/add", wellnessProfileController.postAddProfile);

// /profile/all => GET
router.get("/all", wellnessProfileController.getProfiles);

// /profile/details => GET
router.get(
  "/details/:username",
  wellnessProfileController.getProfileDetailsById
);

// /profile/update => PUT
router.put("/update/:id", wellnessProfileController.updateProfileDetailsById);

// /profile/delete => DELETE
router.delete("/delete/:id", wellnessProfileController.deleteProfileById);

module.exports = router;
