const path = require("path");
const fs = require("fs").promises;
const ejs = require("ejs");
const { htmlToText } = require("html-to-text");
const EmailService = require("./email-service");
require('dotenv').config();

const EMAIL_DOMAIN = "mg@payglow.com";
const APP_NAME = "Pay Glow";

// Initialize EmailService once "mg.Fishpay.com"
const emailService = new EmailService(process.env.MAILGUN_KEY);

async function twoFaVerification(email,code) {
  try {     
    const fileName = path.join(__dirname, './views/2faVerification.ejs');
    const template = await fs.readFile(fileName, 'utf8');

    const html = ejs.render(template, {
        verificationCode:code,
      logoUrl:null,     
    });

    const textVersion = htmlToText(html, { wordwrap: 130 });

    console.info(`Sending 2FA verification email to ${email}`);

    await emailService.sendEmail(
      `${APP_NAME} <${EMAIL_DOMAIN}>`,
      email,
      'אימות חשבון – PayGlow',
      textVersion,
      html
    );
  } catch (err) {
    console.error('Error sending 2FA email:',err);
  }
}

async function resetPassword(email,link) {
  try {     
    const fileName = path.join(__dirname, './views/resetPassword.ejs');
    const template = await fs.readFile(fileName, 'utf8');

    const html = ejs.render(template, {
      resetLink:link,
      logoUrl:null,     
    });

    const textVersion = htmlToText(html, { wordwrap: 130 });   

    await emailService.sendEmail(
      `${APP_NAME} <${EMAIL_DOMAIN}>`,
      email,
      'Your Journey Is Starting Now',
      textVersion,
      html
    );
  } catch (err) {
    console.error('Error sending 2FA email:',err);
  }
}

module.exports = {
  twoFaVerification,
  resetPassword,
};
