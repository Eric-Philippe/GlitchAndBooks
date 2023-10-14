import nodemailer from "nodemailer";
import { MAIL_PASSWORD, MAIL_USER } from "./env";

export class Mailer {
  private static instance: Mailer;
  private transporter: nodemailer.Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
    });
  }

  public static getInstance(): Mailer {
    if (!Mailer.instance) Mailer.instance = new Mailer();
    return Mailer.instance;
  }

  public async sendMail(mailOptions: MailOptions): Promise<number> {
    return new Promise((resolve, reject) => {
      const fullMailOptions = {
        from: '"Glitch & Books" <glitchandbooks.noreply@gmail.com>',
        ...mailOptions,
      };
      this.transporter.sendMail(fullMailOptions, (error, info) => {
        if (error) {
          reject(500);
        } else {
          resolve(200);
        }
      });
    });
  }
}

export interface MailOptions {
  to: string;
  subject: string;
  text: string;
}
