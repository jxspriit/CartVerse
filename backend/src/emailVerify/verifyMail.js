import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// IMPORTANT: transporter must be declared BEFORE VerifyEmail
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const VerifyEmail = async (token, email) => {
  try {
    console.log("📨 Sending email to:", email);

    const verificationLink =
      `https://cartverse-jade.vercel.app//verify/${token}`;

    console.log("🔗 Verification link:", verificationLink);

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Email Verification",

      text: `
Hi!

Thank you for registering on our website.

Please verify your email by clicking the link below:

${verificationLink}

This verification link will expire in 10 days.

Thanks!
      `,
    };

    const info = await transporter.sendMail(mailConfigurations);

    console.log("✅ Email Sent Successfully");
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);
    console.log("Response:", info.response);
    console.log("Message ID:", info.messageId);

    return info;

  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
    throw error;
  }
};





