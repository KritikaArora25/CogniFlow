// smtp.config.js
import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create transporter for Gmail
export const mailClient = nodemailer.createTransport({
    host: process.env.SMTP_HOST,   // smtp.gmail.com
    port: process.env.SMTP_PORT,   // 587
    secure: false,                 // true if port 465
    auth: {
        user: process.env.SMTP_USER, // your Gmail
        pass: process.env.SMTP_PASS, // your App Password
    },
});

export const sender = {
    email: process.env.SMTP_USER,
    name: 'CogniFlow',
};

console.log('Gmail SMTP client initialized');
