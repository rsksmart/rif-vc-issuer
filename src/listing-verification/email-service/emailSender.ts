import { VerificationSender } from "./Sender";
import Mail from 'nodemailer/lib/mailer'
import { MailOptions } from "nodemailer/lib/json-transport";
import { getTestMessageUrl } from "nodemailer";

export class EmailVerificationSender implements VerificationSender {

    constructor(
        private mailServer: Mail,
        private mailOptions: MailOptions,
    ) {
        this.mailServer = mailServer;
        this.mailOptions = mailOptions;
    }
    
    async send<T>(recipient: string, text: string): Promise<T> {
       return this.mailServer.sendMail({
        from: this.mailOptions?.from ?? `RIFProtocols@rsk.org`,
        to: recipient,
        subject: this.mailOptions?.subject ?? 'RIF Gateway provider verification',
        text: text ?? this.mailOptions?.text,
        html: this.mailOptions?.html ?? '',
       });
    }

    logResponse(info: any): string | false {
        return getTestMessageUrl(info);
    }
}