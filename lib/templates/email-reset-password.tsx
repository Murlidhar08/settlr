export function getResetPasswordEmailHtml(
  email: string,
  resetUrl: string
): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Reset Password</title>
  </head>

  <body style="margin:0; padding:0; background:#f6f7f9; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:50px 0; background:#f6f7f9;">
      <tr>
        <td align="center">

          <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 3px 12px rgba(0,0,0,0.06);">

            <!-- BRAND HEADER -->
            <tr>
              <td style="background:#18181b; padding:28px 40px; text-align:center;">
                <span style="font-size:26px; font-weight:700; color:#ffffff; letter-spacing:0.5px;">Settlr</span>
              </td>
            </tr>

            <!-- TITLE -->
            <tr>
              <td style="padding:40px 40px 15px 40px; text-align:center;">
                <h1 style="margin:0; font-size:24px; font-weight:600; color:#18181b;">
                  Reset Your Password
                </h1>
              </td>
            </tr>

            <!-- MAIN CONTENT -->
            <tr>
              <td style="padding:0 40px 35px 40px; color:#52525b; font-size:16px; line-height:26px;">

                <p style="margin:0 0 18px;">
                  Hello,
                </p>

                <p style="margin:0 0 18px;">
                  We received a request to reset the password for your Settlr account associated with:
                  <strong>${email}</strong>
                </p>

                <p style="margin:0 0 28px;">
                  Click the button below to choose a new password.
                </p>

                <!-- CTA BUTTON -->
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding-bottom:28px;">
                      <a href="${resetUrl}" style="display:inline-block; padding:14px 36px; background:#18181b; color:#ffffff; border-radius:6px; text-decoration:none; font-size:16px; font-weight:500;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <!-- URL -->
                <p style="margin:0 0 14px; font-size:14px; color:#71717a;">
                  Or paste this link into your browser:
                </p>

                <p style="margin:0 0 24px; font-size:14px; color:#2563eb; word-break:break-all;">
                  ${resetUrl}
                </p>

                <!-- NOTES -->
                <p style="margin:0 0 14px; font-size:14px; color:#71717a;">
                  This link will expire in 1 hour for security purposes.
                </p>

                <p style="margin:0; font-size:14px; color:#71717a;">
                  If you didn’t request this password reset, you can safely ignore this email.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 40px; background:#fafafa; border-top:1px solid #e5e7eb;">
                <p style="margin:0; font-size:12px; color:#9ca3af; text-align:center; line-height:18px;">
                  © ${new Date().getFullYear()} Settlr. All rights reserved.<br/>
                  This is an automated message—please do not reply.
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