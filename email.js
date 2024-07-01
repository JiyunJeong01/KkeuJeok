const nodemailer = require("nodemailer");
require('dotenv').config();

const smtpTransport = nodemailer.createTransport({
    pool: true,
    maxConnections: 1,
    service: "naver",
    host: "smtp.naver.com",
    port: 465,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMPT_USER,
        pass: process.env.SMPT_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = smtpTransport;