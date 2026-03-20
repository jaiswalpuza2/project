const { generateEsewaSignature } = require('./backend/utils/esewa.js');

const amount = "100";
const transactionUuid = "11-201-13";
const productCode = "EPAYTEST";
const secretKey = "8g7h9jk9v3ld9";

const message = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
console.log("Message String:", message);
console.log("Message Length:", message.length);

console.log("Message Hex:", Buffer.from(message).toString('hex'));
console.log("Secret Hex:", Buffer.from(secretKey).toString('hex'));

const signature = generateEsewaSignature(message, secretKey);
console.log("Generated Signature Hex:", Buffer.from(signature).toString('hex'));
