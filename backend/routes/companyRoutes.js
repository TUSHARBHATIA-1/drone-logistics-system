const express = require("express");
const router = express.Router();
const { createCompany, getMyCompany } = require("../controllers/companyController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/company", protect, createCompany);
router.get("/company/me", protect, getMyCompany);

module.exports = router;