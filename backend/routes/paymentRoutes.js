const express = require("express");
const { initiateEscrow, getMyPayments, getEsewaParameters, verifyEsewaPayment, initiateKhaltiPayment, verifyKhaltiPayment } = require("../controllers/paymentController");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
router.post("/escrow", protect, authorize("employer"), initiateEscrow);
router.get("/my-payments", protect, getMyPayments);
router.post("/initiate-esewa", protect, authorize("employer"), getEsewaParameters);
router.get("/verify-esewa", verifyEsewaPayment);
router.post("/initiate-khalti", protect, authorize("employer"), initiateKhaltiPayment);
router.post("/verify-khalti", verifyKhaltiPayment); // Public callback
module.exports = router;
