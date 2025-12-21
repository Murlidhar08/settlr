export function getResetPasswordEmailHtml(
  email: string,
  resetUrl: string
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
              <!-- Header -->
              <tr>
                <td style="padding: 40px 40px 20px 40px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #18181b;">Reset Your Password</h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 0 40px 30px 40px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #52525b;">
                    Hi there,
                  </p>
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 24px; color: #52525b;">
                    We received a request to reset the password for your account (<strong>${email}</strong>).
                  </p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 24px; color: #52525b;">
                    Click the button below to reset your password:
                  </p>
                  
                  <!-- Button -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="center" style="padding: 0 0 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #18181b; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 500;">Reset Password</a>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 20px; color: #71717a;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 20px; color: #3b82f6; word-break: break-all;">
                    ${resetUrl}
                  </p>
                  
                  <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 20px; color: #71717a;">
                    This link will expire in 1 hour for security reasons.
                  </p>
                  <p style="margin: 0; font-size: 14px; line-height: 20px; color: #71717a;">
                    If you didn't request a password reset, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 30px 40px 40px 40px; border-top: 1px solid #e4e4e7;">
                  <p style="margin: 0; font-size: 12px; line-height: 18px; color: #a1a1aa; text-align: center;">
                    This is an automated message, please do not reply to this email.
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
