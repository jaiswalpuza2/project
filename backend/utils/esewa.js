const CryptoJS = require("crypto-js");
const generateEsewaSignature = (message, secret) => {
    const hash = CryptoJS.HmacSHA256(message, secret);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    return hashInBase64;
};
module.exports = { generateEsewaSignature };
