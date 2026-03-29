const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
    try {
        await transporter.verify();
        console.log("SMTP Server is ready to take our messages");
    } catch (err) {
        console.error("SMTP Connection Error Details:", err.message);
        throw err;
    }
    const message = {
        from: `${process.env.FROM_NAME || "JobSphere"} <${process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };
    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
};
module.exports = sendEmail;
