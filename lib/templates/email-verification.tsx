import { envServer } from "../env.server";

export function getVerificationEmailHtml(
  email: string,
  verifyUrl: string
): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Verification</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f7f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9; padding:50px 0;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; box-shadow:0 3px 12px rgba(0,0,0,0.06); overflow:hidden;">

            <!-- Brand Header -->
            <tr>
              <td style="background:#18181b; padding:28px 40px; text-align:center;">
                <span style="font-size:26px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">
                  ${envServer.NEXT_PUBLIC_APP_NAME}
                </span>
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding:40px 40px 10px 40px; text-align:center;">
                <h1 style="margin:0; font-size:24px; font-weight:600; color:#18181b;">
                  Confirm Your Email Address
                </h1>
              </td>
            </tr>

            <!-- Body Content -->
            <tr>
              <td style="padding:0 40px 35px 40px; color:#52525b; font-size:16px; line-height:26px;">
                <p style="margin:0 0 18px;">
                  Hi,
                </p>

                <p style="margin:0 0 18px;">
                  A request was made to verify the email address associated with your ${envServer.NEXT_PUBLIC_APP_NAME} account:
                  <strong>${email}</strong>
                </p>

                <p style="margin:0 0 28px;">
                  Please click the button below to complete your email verification.
                </p>

                <!-- CTA Button -->
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" style="padding-bottom:28px;">
                      <a href="${verifyUrl}"
                        style="
                          display:inline-block;
                          padding:14px 36px;
                          background:#18181b;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:6px;
                          font-size:16px;
                          font-weight:500;
                        ">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0 0 14px; font-size:14px; color:#71717a;">
                  Or paste this link into your browser:
                </p>

                <p style="margin:0 0 24px; font-size:14px; color:#2563eb; word-break:break-all;">
                  ${verifyUrl}
                </p>

                <p style="margin:0 0 14px; font-size:14px; color:#71717a;">
                  This link will expire in 1 hour.
                </p>

                <p style="margin:0; font-size:14px; color:#71717a;">
                  If you did not request this verification, you can safely ignore this email.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 40px; background:#fafafa; border-top:1px solid #e5e7eb;">
                <p style="margin:0; font-size:12px; line-height:18px; text-align:center; color:#9ca3af;">
                  © ${new Date().getFullYear()} ${envServer.NEXT_PUBLIC_APP_NAME}. All rights reserved.<br/>
                  This is an automated email—please do not reply.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
  </html>
  `.trim();
}