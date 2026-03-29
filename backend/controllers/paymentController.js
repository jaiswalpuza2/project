const Payment = require("../models/Payment");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { generateEsewaSignature } = require("../utils/esewa");
const axios = require("axios");
exports.initiateEscrow = async (req, res, next) => {
    try {
        const { jobId, freelancerId, amount } = req.body;
        const payment = await Payment.create({
            job: jobId,
            employer: req.user.id,
            freelancer: freelancerId,
            amount,
            status: "escrowed",
            transactionId: "MOCK_TXN_" + Math.random().toString(36).substring(7).toUpperCase(),
        });
        await Notification.create({
            recipient: freelancerId,
            message: `Payment of Rs. ${amount} has been escrowed for job: ${jobId}`,
            type: "payment",
            relatedId: payment._id,
        });
        res.status(201).json({
            success: true,
            data: payment,
        });
    } catch (err) {
        next(err);
    }
};
exports.getMyPayments = async (req, res, next) => {
    try {
        const payments = await Payment.find({
            $or: [{ employer: req.user.id }, { freelancer: req.user.id }],
        })
            .populate("job", "title")
            .populate("employer", "name")
            .populate("freelancer", "name")
            .sort("-createdAt");
        res.status(200).json({
            success: true,
            data: payments,
        });
    } catch (err) {
        next(err);
    }
};
exports.getEsewaParameters = async (req, res, next) => {
    try {
        const { jobId, freelancerId, amount } = req.body;
        const transactionUuid = `ESEWA-${Date.now()}-${req.user.id}`;
        const productCode = (process.env.ESEWA_MERCHANT_CODE || "EPAYTEST").trim();
        const secretKey = (process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q").trim();
        await Payment.create({
            job: jobId,
            employer: req.user.id,
            freelancer: freelancerId,
            amount,
            status: "pending",
            transactionId: transactionUuid,
        });
        const signatureMessage = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const signature = generateEsewaSignature(signatureMessage, secretKey);
        const esewaData = {
            amount,
            tax_amount: 0,
            total_amount: amount,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: 0,
            product_delivery_charge: 0,
            success_url: `${process.env.FRONTEND_URL}/payment-success`,
            failure_url: `${process.env.FRONTEND_URL}/payment-failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature: signature,
        };
        res.status(200).json({
            success: true,
            data: esewaData,
        });
    } catch (err) {
        next(err);
    }
};
exports.verifyEsewaPayment = async (req, res, next) => {
    try {
        const { data } = req.query; // eSewa returns base64 encoded data in 'data' query param
        if (!data) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
        if (decodedData.status !== "COMPLETE") {
            return res.status(400).json({ success: false, message: "Payment not completed" });
        }
        const payment = await Payment.findOneAndUpdate(
            { transactionId: decodedData.transaction_uuid },
            { status: "escrowed" },
            { new: true }
        );
        await Notification.create({
            recipient: payment.freelancer,
            message: `eSewa payment verified and escrowed for your project.`,
            type: "payment",
            relatedId: payment._id,
        });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }
        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (err) {
        next(err);
    }
};
exports.initiateKhaltiPayment = async (req, res, next) => {
    try {
        const { jobId, freelancerId, amount } = req.body;
        const transactionId = `KHALTI-${Date.now()}-${req.user.id}`;
        await Payment.create({
            job: jobId,
            employer: req.user.id,
            freelancer: freelancerId,
            amount,
            status: "pending",
            transactionId,
        });
        const khaltiPayload = {
            return_url: `${process.env.FRONTEND_URL}/payment-success?gateway=khalti`,
            website_url: process.env.FRONTEND_URL,
            amount: amount * 100, // Khalti amount must be in Paisa
            purchase_order_id: transactionId,
            purchase_order_name: `Payment for Job ${jobId}`,
            customer_info: {
                name: req.user.name,
                email: req.user.email || "test@test.com",
                phone: "9800000000"
            }
        };
        const response = await axios.post(
            "https://a.khalti.com/api/v2/epayment/initiate/",
            khaltiPayload,
            {
                headers: {
                    Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                }
            }
        );
        res.status(200).json({
            success: true,
            payment_url: response.data.payment_url, // URL to redirect the user
            pidx: response.data.pidx
        });
    } catch (err) {
        console.error("Khalti Initiate Error:", err.response?.data || err.message);
        next(err);
    }
};
exports.verifyKhaltiPayment = async (req, res, next) => {
    try {
        const { pidx } = req.body;
        if (!pidx) {
            return res.status(400).json({ success: false, message: "Missing pidx" });
        }
        const response = await axios.post(
            "https://a.khalti.com/api/v2/epayment/lookup/",
            { pidx },
            {
                headers: {
                    Authorization: `key ${process.env.KHALTI_SECRET_KEY}`,
                    "Content-Type": "application/json",
                }
            }
        );
        if (response.data.status !== "Completed") {
            return res.status(400).json({ success: false, message: "Khalti payment not completed" });
        }
        const payment = await Payment.findOneAndUpdate(
            { transactionId: response.data.purchase_order_id },
            { status: "escrowed" },
            { new: true }
        );
        await Notification.create({
            recipient: payment.freelancer,
            message: `Khalti payment verified and escrowed for your project.`,
            type: "payment",
            relatedId: payment._id,
        });
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }
        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (err) {
        console.error("Khalti Verify Error:", err.response?.data || err.message);
        next(err);
    }
};
