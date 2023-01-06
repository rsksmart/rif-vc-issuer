import e from "express";
import { createTestAccount, createTransport } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { EmailVerificationSender } from "./emailSender";

export const verificationSenderType = {
    email: 'email'
} as const;

export type VerificationSenderType = keyof typeof verificationSenderType;

export class VerificationSenderFactory {
   public static async getEmailVerificationService(options?: SMTPTransport.Options) {      
      const mail = createTransport(options);
   
      return new EmailVerificationSender(
        mail, 
        options  
      );
   }
}