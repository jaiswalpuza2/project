const CryptoJS = require("crypto-js");

/**
 * Generate eSewa Signaturea
 * @param {string} message - String in format: total_amount=VAL,transaction_uuid=VAL,product_code=VAL
 * @param {string} secret - eSewa Secret Key
 * @returns {string} - Base64 encoded HMAC-SHA256 signature
 */
const generateEsewaSignature = (message, secret) => {
    const hash = CryptoJS.HmacSHA256(message, secret);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
};

module.exports = { generateEsewaSignature };


