// Packages
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession } from "better-auth/plugins";

// Lib
import { prisma } from "./prisma";
import { FROM_EMAIL, resend } from "./resend";

// Template
import { getResetPasswordEmailHtml } from "./templates/email-reset-password";
import { getVerificationEmailHtml } from "./templates/email-verification";
import { getPasswordResetSuccessEmailHtml } from "./templates/email-password-reseted";
import { headers } from "next/headers";
import { Currency, PaymentMode, ThemeMode } from "./generated/prisma/enums";

// Const
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";

export const auth = betterAuth({
  appName: "Settlr",
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      contactNo: {
        type: "string",
      },
      address: {
        type: "string",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // Send password reset mail
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
    },

    // Send password reset successfully mail
    onPasswordReset: async ({ user }) => {
      try {
        const emailHtml = getPasswordResetSuccessEmailHtml(user.email, appUrl);

        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Password Reset Successful",
          html: emailHtml,
        });

        if (error) {
          console.error("Failed to send password reset success email:", error);
          throw new Error("Failed to send password reset success email");
        }

        console.log("Password reset success email sent to:", user.email);
        console.log("Email ID:", data?.id);
      } catch (err) {
        console.error("Error in onPasswordReset:", err);
        throw err;
      }
    }
  },
  emailVerification: {
    // After sign up verification link sended to mail
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const emailHtml = getVerificationEmailHtml(user.email, url);

        // Send the email using Resend
        const { data, error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject: "Verify Email",
          html: emailHtml,
        });

        if (error) {
          console.error("Failed to send verification password email:", error)
          throw new Error("Failed to send verification password email")
        }
        console.log("Verification password email sent successfully to:", user.email)
        console.log("Email ID:", data?.id)

        // In development, also log the URL for easy testing
        if (process.env.NODE_ENV === "development") {
          console.log("verification URL (dev only):", url)
        }

      } catch (error) {
        console.error("Error in sendVerificationMail:", error)
        throw error
      }
    },
    afterEmailVerification: async (user, request) => {
      // Add Default Business
      await prisma.business.create({
        data: {
          name: "Default Business",
          ownerId: user.id,
        }
      });

      console.log(`${user.email} has been successfully verified!`);
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },
  session: {
    // PENDING CACHE
    // cookieCache: {
    //   enabled: true,
    //   maxAge: 10 // 1 Minute
    // },
    additionalFields: {
      activeBusinessId: {
        type: "string",
        required: false
      }
    },
  },
  plugins: [
    nextCookies(),
    customSession(async ({ user, session }) => {
      // Fetch extended settings from database
      const settings = await prisma.userSettings.findUnique({
        where: { userId: user.id },
        select: {
          currency: true,
          dateFormat: true,
          defaultPayment: true,
          theme: true
        }
      });

      const mergedSettings = {
        currency: settings?.currency ?? Currency.INR,
        dateFormat: settings?.dateFormat ?? "DD/MM/YYYY",
        defaultPayment: settings?.defaultPayment ?? PaymentMode.CASH,
        theme: settings?.theme ?? ThemeMode.AUTO,
      };

      return {
        session,
        user: {
          ...user,
          settings: mergedSettings
        },
      };
    }),
  ]
});

export const getUserSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};
