import nodemailer, { SentMessageInfo } from "nodemailer"

export const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
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
      from: process.env.FROM_EMAIL,
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
