const express = require("express");
const { initiateEscrow, getMyPayments, getEsewaParameters, verifyEsewaPayment } = require("../controllers/paymentController");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
router.post("/escrow", protect, authorize("employer"), initiateEscrow);
router.get("/my-payments", protect, getMyPayments);
router.post("/initiate-esewa", protect, authorize("employer"), getEsewaParameters);
router.get("/verify-esewa", verifyEsewaPayment);
module.exports = router;
