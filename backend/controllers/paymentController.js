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
        const formattedAmount = Number(amount).toFixed(2);
        const transactionUuid = `JS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const productCode = (process.env.ESEWA_MERCHANT_CODE || "EPAYTEST").trim();
        const secretKey = (process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q").trim();

        await Payment.create({
            job: jobId,
            employer: req.user.id,
            freelancer: freelancerId,
            amount: Number(amount),
            status: "pending",
            transactionId: transactionUuid,
        });

     
        const signatureMessage = `total_amount=${formattedAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const signature = generateEsewaSignature(signatureMessage, secretKey);

        const esewaData = {
            amount: formattedAmount,
            tax_amount: "0.00",
            total_amount: formattedAmount,
            transaction_uuid: transactionUuid,
            product_code: productCode,
            product_service_charge: "0.00",
            product_delivery_charge: "0.00",
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
        const { data } = req.query; 
        if (!data) {
            return res.status(400).json({ success: false, message: "No data provided" });
        }
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
        const payment = await Payment.findOneAndUpdate(
            { transactionId: decodedData.transaction_uuid },
            { status: "escrowed" },
            { new: true }
        );
        
        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        await Notification.create({
            recipient: payment.freelancer,
            message: `eSewa payment verified and funds of NPR ${payment.amount} have been escrowed.`,
            type: "payment",
            relatedId: payment._id,
        });

        res.status(200).json({
            success: true,
            data: payment,
        });
    } catch (err) {
        next(err);
    }
};
