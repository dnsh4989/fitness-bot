const express = require("express");

const profileController = require("../controllers/profile");

const router = express.Router();

// /profile/all => GET
router.get("/tech/all", profileController.getProfiles);

// /profile/details => GET
router.get("/tech/details/:username", profileController.getProfileDetailsById);

// /profile/update => PUT
router.put("/tech/update/:id", profileController.updateProfileDetailsById);

// /profile/delete => DELETE
router.delete("/tech/delete/:id", profileController.deleteProfileById);

module.exports = router;
