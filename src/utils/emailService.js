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

const styles = `
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f9f9f9;
      }
      .header {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .content {
        margin-bottom: 20px;
      }
      .cta {
        display: inline-block;
        padding: 10px 20px;
        margin-top: 20px;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        border-radius: 5px;
      }
      .cta:hover {
        background-color: #0056b3;
      }
      .address {
        font-style: italic;
        color: #555;
      }
    </style>
  `;

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
const updateTradeEmailContent = ({
  recipientName,
  initiatorName,
  offeredBookTitle,
  requestedBookTitle,
  initiatorAddress,
  recipientAddress,
  tradeLink,
  status,
}) => {
  let bodyContent = "";
  if (status === "accepted") {
    bodyContent = `
      <div class="content">
        <p>Hi ${recipientName},</p>
        <p>Your trade has been accepted! Here are the details:</p>
        <ul>
          <li><strong>${initiatorName}'s Book:</strong> ${offeredBookTitle}</li>
          <li><strong>Your Book:</strong> ${requestedBookTitle}</li>
        </ul>
        <p>Please send your book to:</p>
        <p class="address">${recipientAddress.route} ${recipientAddress.street_number}, ${recipientAddress.postal_code}, ${recipientAddress.locality}, ${recipientAddress.country}</p>
        <p>Meanwhile, ${initiatorName} will mail their book to your address:</p>
        <p class="address">${initiatorAddress.route} ${initiatorAddress.street_number}, ${initiatorAddress.postal_code}, ${initiatorAddress.locality}, ${initiatorAddress.country}</p>
      </div>
    `;
  } else if (status === "rejected") {
    bodyContent = `
      <div class="content">
        <p>Hi ${recipientName},</p>
        <p>The trade has been <strong>rejected</strong>. Feel free to explore other trades!</p>
      </div>
    `;
  } else if (status === "canceled") {
    bodyContent = `
      <div class="content">
        <p>Hi ${recipientName},</p>
        <p>The trade has been <strong>canceled</strong>.</p>
      </div>
    `;
  }

  return `
    ${styles}
    <div class="email-container">
      <div class="header">Trade Notification</div>
      ${bodyContent}
      <a class="cta" href="${tradeLink}">View Trade Details</a>
      <p>Thank you for using TradeMyBook!</p>
    </div>
  `;
};
const createTradeEmailContent = ({
  recipientName,
  initiatorName,
  initiatorEmail,
  offeredBookTitle,
  requestedBookTitle,
  initiatorAddress,
  recipientAddress,
  tradeLink,
}) => {
  const bodyContent = `
    <div class="content">
      <p>Hi ${recipientName},</p>
      <p>${initiatorName} has offered a trade with you.</p>
      <ul>
        <li><strong>Offered Book: ${offeredBookTitle}</li>
        <li><strong>Requested Book: ${requestedBookTitle}</li>
      </ul>
      <p>If you choose to accept the trade, you will need to mail the book to :</p>
      <p class="address">${initiatorName}, ${initiatorAddress.route} ${initiatorAddress.street_number}, ${initiatorAddress.postal_code} ${initiatorAddress.locality}, ${initiatorAddress.country}.</p>
      <p>You will also have to trust that ${initiatorName} will send you his book to your address:</p>
      <p class="address">${recipientAddress.route} ${recipientAddress.street_number}, ${recipientAddress.postal_code}, ${recipientAddress.locality}, ${recipientAddress.country}</p>
      <p Please contact ${initiatorEmail} if you have any questions.</p>
    </div>
`;

  return `
    ${styles}
    <div class="email-container">
      <div class="header">Trade Notification</div>
      ${bodyContent}
      <a class="cta" href="${tradeLink}">View Trade Details</a>
      <p>Thank you for using TradeMyBook!</p>
    </div>
  `;
};
module.exports = {
  sendEmail,
  sendConfirmationEmail,
  createTradeEmailContent,
  updateTradeEmailContent,
};
