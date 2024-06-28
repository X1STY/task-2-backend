// mail.service.ts
import { Injectable } from '@nestjs/common';
import { ActionType } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'burley.morissette@ethereal.email',
        pass: 'ge2WrPPj5S4D3PsX78'
      }
    });
  }

  async sendPasswordResetEmail(to: string, token: string, type: ActionType) {
    const resetLink = `https://frontendurl.ru/action?type=${type}&token=${token}`;
    const mailOptions = {
      from: 'noreply@yourapp.com',
      to: to,
      subject: 'Password Reset Request',
      html: `<p>You requested password change. Click the link below to change your password:</p><p><a href="${resetLink}">Change Password</a></p>`
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendRegistrationConfirmEmail(to: string, token: string, type: ActionType) {
    const resetLink = `https://frontendurl.ru/action?type=${type}&token=${token}`;
    const mailOptions = {
      from: 'noreply@yourapp.com',
      to: to,
      subject: 'Registration Confirmation',
      html: `<p>Welcome to our service. Click the link below to confirm your email:</p><p><a href="${resetLink}">Reset Password</a></p>`
    };

    await this.transporter.sendMail(mailOptions);
  }
}
