const express = require("express");
const router = express.Router();
const controller = require("../controllers/subscriptionController");

router.post("/", controller.createSubscription);

module.exports = router;