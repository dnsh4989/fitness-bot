const express = require("express");

const retweetController = require("../controllers/retweet");

const router = express.Router();

// /retweet/user => POST
router.get("/smart/wellness", retweetController.retweetSmart);

// /retweet/user => POST
router.get("/nextSchedule", retweetController.nextSchedule);

module.exports = router;
