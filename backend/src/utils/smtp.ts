import { readFileSync } from 'fs';
import Handlebars from 'handlebars';
import nodemailer, {
  Transport,
  TransportOptions,
  Transporter,
} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import path from 'path';

const options = {
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT || '465',
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};
const transporter: Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport(options as TransportOptions);

export async function distributeJournalEntries({
  identifier,
  url,
}: {
  identifier: string | undefined;
  url: string | undefined;
}) {
  try {
    const fullPath = path.join(__dirname, '../emails/journal.html');
    const emailFile = readFileSync(fullPath, 'utf8');
    const emailTemplate = Handlebars.compile(emailFile);
    transporter.sendMail({
      from: `"✨📚 Random Journal" ${process.env.EMAIL_FROM}`,
      to: identifier,
      subject: 'Your Random Journal Entry',
      html: emailTemplate({
        base_url: 'https://random-journal.onrender.com',
        signin_url: url,
        email: identifier,
      }),
    });
  } catch (e) {
    console.log(e);
  }
}
