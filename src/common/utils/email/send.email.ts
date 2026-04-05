import { APPLICATION_NAME, GMAIL, PASSWORD } from "../../../config/config";

import nodemailer from 'nodemailer'

import { Attachment } from "nodemailer/lib/mailer";

interface SendEmailParams {
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    subject: string;
    html: string;
    attachments?: Attachment[];
}
export const sendEmail = async ({
    to,
    cc,
    bcc,
    subject,
    html,
    attachments = [],
    }: SendEmailParams) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: GMAIL,
        pass: PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
        from: `"${APPLICATION_NAME}📱" <${GMAIL}>`,
        to,
        cc,
        bcc,
        subject,
        html,
        attachments,
        });

        console.log("Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Failed to send email:", error);
        throw error;
    }
};