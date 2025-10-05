// emails.js
import { mailClient, sender } from './smtp.config.js';
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE
} from './emailsTemplates.js';

const sendMail = async ({ to, subject, html, text }) => {
    try {
        const info = await mailClient.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to,
            subject,
            html,
            text,
        });
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(error.message);
    }
};

export const sendVerificationEmail = (email, name, code) => {
    return sendMail({
        to: email,
        subject: 'Verify Your Email - CogniFlow',
        html: VERIFICATION_EMAIL_TEMPLATE(name, code),
        text: `Hello ${name}, your verification code is: ${code}`,
    });
};

export const sendWelcomeEmail = (email, name) => {
    return sendMail({
        to: email,
        subject: 'Welcome to CogniFlow!',
        html: WELCOME_EMAIL_TEMPLATE(name),
        text: `Welcome ${name}, your email is verified!`,
    });
};

export const sendPasswordResetRequestEmail = (email, name, resetURL) => {
    return sendMail({
        to: email,
        subject: 'Reset Your Password - CogniFlow',
        html: PASSWORD_RESET_REQUEST_TEMPLATE(name, resetURL),
        text: `Hello ${name}, reset your password using this link: ${resetURL}`,
    });
};

export const sendPasswordResetSuccessEmail = (email, name) => {
    return sendMail({
        to: email,
        subject: 'Password Reset Successful - CogniFlow',
        html: PASSWORD_RESET_SUCCESS_TEMPLATE(name),
        text: `Hello ${name}, your password has been successfully reset.`,
    });
};
