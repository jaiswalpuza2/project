const nodemailer = require("nodemailer");


let transporter;

const createTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_PORT == 465, 
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        tls: {
            rejectUnauthorized: false
        },
        pool: true,
        maxConnections: 5,
        maxMessages: 100
    });

    return transporter;
};

const sendEmail = async (options) => {
    const mailTransporter = createTransporter();

    const message = {
        from: `${process.env.FROM_NAME || "JobSphere"} <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };

    try {
        const info = await mailTransporter.sendMail(message);
        console.log("Message sent: %s to %s", info.messageId, options.email);
        return info;
    } catch (err) {
        console.error("Nodemailer delivery failed:", err);
        return null;
    }
};

module.exports = sendEmail;
