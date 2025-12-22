import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { getResetPasswordEmailHtml } from "./email-template";
import { FROM_EMAIL, resend } from "./resend";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {

      try {
        const emailHtml = getResetPasswordEmailHtml(user.email, url)

        // Send the email using Resend
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Reset Your Password",
          html: emailHtml,
        });

        if (error) {
          console.error("Failed to send reset password email:", error)
          throw new Error("Failed to send reset password email")
        }
        console.log("Reset password email sent successfully to:", user.email)
        console.log("Email ID:", data?.id)

        // In development, also log the URL for easy testing
        if (process.env.NODE_ENV === "development") {
          console.log("Reset URL (dev only):", url)
        }

      } catch (error) {
        console.error("Error in sendResetPassword:", error)
        throw error
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }
  },
  rateLimit: {
    storage: "database"
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 // 1 Minute
    }
  },
  plugins: [nextCookies()]
});