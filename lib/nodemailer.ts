import { createTransport, SentMessageInfo } from "nodemailer"
import { envServer } from "./env.server";

export const smtpTransporter = createTransport({
  host: envServer.SMTP_HOST,
  port: Number(envServer.SMTP_PORT),
  secure: envServer.SMTP_SECURE === "true", // true for 465, false for STARTTLS
  auth: {
    user: envServer.SMTP_USER,
    pass: envServer.SMTP_PASS,
  },
});

// Optional: test SMTP config
export async function verifySMTP() {
  try {
    await smtpTransporter.verify();
    console.log("SMTP server ready to send emails");
  } catch (err) {
    console.error("SMTP verification failed", err);
  }
}

interface sendMailProp {
  sendTo: string
  subject: string
  htmlContent: string
}
export async function sendMail({ sendTo, subject, htmlContent }: sendMailProp):
  Promise<{
    success: boolean;
    messageId?: string;
    data: SentMessageInfo | null;
    error?: string;
  }> {
  try {
    // Build email options
    const mailOptions = {
      from: envServer.FROM_EMAIL,
      to: sendTo,
      subject,
      html: htmlContent,
    };

    // Send email
    const info = await smtpTransporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId,
      data: info
    }
  }
  catch (error: any) {
    console.error("SMTP send error:", error);
    return {
      success: false,
      error: error.message,
      data: null,
    };
  }
}
