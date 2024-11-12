const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendEmail = async (to, subject, htmlContent) => {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
const sendConfirmationEmail = async (email, token, name) => {
  const confirmationLink = `${process.env.FRONTEND_URL}/confirm/${token}`;
  const emailContent = `
    <h2>Hi ${name},</h2>
    <p>Thank you for registering at TradeMyBook!</p>
    <p>Please confirm your email address by clicking the link below:</p>
    <a href="${confirmationLink}">Confirm Email</a>
    <p>Alternatively, you can copy and paste the link below into your browser:</p> <p>${confirmationLink}</p>
  `;

  await sendEmail(email, "Confirm Your Email", emailContent);
};
module.exports = {
  sendEmail,
  sendConfirmationEmail,
};
