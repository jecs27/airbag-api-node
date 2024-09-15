import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const {
  USER_EMAIL: userEmail,
  USER_PASSWORD: userPassword
} = process.env;

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: userEmail,
    pass: userPassword
  }
});

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: userEmail,
      to,
      subject,
      html
    };
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
