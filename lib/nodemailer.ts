import { createTransport, SentMessageInfo } from "nodemailer"
import { envServer } from "./env.server";
import { getAppConfig } from "./app-config";

async function getSmtpTransporter() {
  const config = await getAppConfig();

  return createTransport({
    host: config.smtpHost || envServer.SMTP_HOST,
    port: Number(config.smtpPort || envServer.SMTP_PORT),
    secure: config.smtpSecure ?? (envServer.SMTP_SECURE === "true"),
    auth: {
      user: config.smtpUser || envServer.SMTP_USER,
      pass: config.smtpPass || envServer.SMTP_PASS,
    },
  });
}

// Optional: test SMTP config
export async function verifySMTP() {
  try {
    const transporter = await getSmtpTransporter();
    await transporter.verify();
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
    const config = await getAppConfig();
    const transporter = await getSmtpTransporter();

    // Build email options
    const mailOptions = {
      from: config.fromEmail || envServer.FROM_EMAIL,
      to: sendTo,
      subject,
      html: htmlContent,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

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
