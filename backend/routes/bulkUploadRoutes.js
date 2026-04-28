const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const controller = require("../controllers/bulkUploadController");

router.post("/doctors", upload.single("file"), controller.uploadDoctors);
router.post("/medicines", upload.single("file"), controller.uploadMedicines);
router.post("/tests", upload.single("file"), controller.uploadTests);
router.post("/bloodbanks", upload.single("file"), controller.uploadBloodBanks);

module.exports = router;