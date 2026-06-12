const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendVerificationEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Car Dealership" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Email tasdiqlash kodi",
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #2563eb;">Email tasdiqlash</h2>
        <p>Tasdiqlash kodingiz:</p>
        <h1 style="letter-spacing: 8px; color: #1d4ed8;">${code}</h1>
        <p style="color: #666; font-size: 13px;">Bu kod 10 daqiqa davomida amal qiladi.</p>
      </div>
    `,
  });
};

const sendForgotPasswordEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"Car Dealership" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Parolni tiklash kodi",
    html: `
      <div style="font-family: Arial; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #dc2626;">Parolni tiklash</h2>
        <p>Parolni tiklash kodingiz:</p>
        <h1 style="letter-spacing: 8px; color: #b91c1c;">${code}</h1>
        <p style="color: #666; font-size: 13px;">Bu kod 10 daqiqa davomida amal qiladi.</p>
      </div>
    `,
  });
};

module.exports = { sendVerificationEmail, sendForgotPasswordEmail };
