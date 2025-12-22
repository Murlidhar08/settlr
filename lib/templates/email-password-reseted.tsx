export function getPasswordResetSuccessEmailHtml(
  email: string,
  loginUrl: string
): string {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <title>Password Reset Successful</title>
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
              <td style="padding:40px 40px 10px 40px; text-align:center;">
                <h1 style="margin:0; font-size:24px; font-weight:600; color:#18181b;">
                  Password Reset Successful
                </h1>
              </td>
            </tr>

            <!-- BODY -->
            <tr>
              <td style="padding:0 40px 35px 40px; font-size:16px; line-height:26px; color:#52525b;">
                
                <p style="margin:0 0 18px;">
                  Hello,
                </p>

                <p style="margin:0 0 20px;">
                  The password for your Settlr account
                  <strong>${email}</strong>
                  has been successfully changed.
                </p>

                <p style="margin:0 0 25px;">
                  If you made this request, you’re all set—no further action is needed.
                </p>

                <p style="margin:0 0 28px;">
                  You can now sign in with your new password:
                </p>

                <!-- CTA Button -->
                <table width="100%" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" style="padding-bottom:28px;">
                      <a href="${loginUrl}/login"
                        style="display:inline-block; padding:14px 36px; background:#18181b; color:#ffffff; border-radius:6px; text-decoration:none; font-size:16px; font-weight:500;">
                        Sign In
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin:0; font-size:14px; color:#71717a;">
                  If you did <strong>not</strong> reset your password, please contact support immediately.
                </p>

              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="padding:24px 40px; background:#fafafa; border-top:1px solid #e5e7eb;">
                <p style="margin:0; text-align:center; font-size:12px; color:#9ca3af; line-height:18px;">
                  © ${new Date().getFullYear()} Settlr. All rights reserved.<br/>
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
