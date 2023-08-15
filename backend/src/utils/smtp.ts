import nodemailer, { TransportOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { TranspileOptions } from 'ts-node';

const options = {
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT, 10),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(options as TransportOptions);

export async function sendEmail(recipient, subject, html) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: recipient,
    subject,
    html,
  };
  return transporter.sendMail(mailOptions);
}
