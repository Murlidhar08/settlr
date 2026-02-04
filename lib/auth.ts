// Packages
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin, customSession, lastLoginMethod, twoFactor } from "better-auth/plugins"

// Lib
import { prisma } from "./prisma";
import { sendMail } from "./nodemailer";

// Template
import { getResetPasswordEmailHtml } from "./templates/email-reset-password";
import { getVerificationEmailHtml } from "./templates/email-verification";
import { getPasswordResetSuccessEmailHtml } from "./templates/email-password-reseted";
import { getDeleteAccountEmailHtml } from "./templates/email-delete-account";
import { headers } from "next/headers";
import { Currency, PaymentMode, ThemeMode } from "./generated/prisma/enums";
import { envServer } from "./env.server";

export const auth = betterAuth({
  appName: envServer.NEXT_PUBLIC_APP_NAME,
  baseURL: envServer.BETTER_AUTH_URL,
  secret: envServer.BETTER_AUTH_SECRET,
  trustedOrigins: [
    envServer.BETTER_AUTH_URL,
  ],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
      contactNo: {
        type: "string",
        required: false
      },
      address: {
        type: "string",
        required: false
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        try {
          const emailHtml = getDeleteAccountEmailHtml(user.email, url)

          const { data, error } = await sendMail({
            sendTo: user.email,
            subject: "Confirm Account Deletion",
            htmlContent: emailHtml
          });

          if (error) {
            console.error("Failed to send delete account email:", error)
            throw new Error("Failed to send delete account email")
          }

          console.log("Delete account confirmation email sent to:", user.email)
          console.log("Email ID:", data?.id)

          // Dev-only helper
          if (envServer.NODE_ENV === "development") {
            console.log("Delete confirmation URL (dev only):", url)
          }
        } catch (error) {
          console.error("Error in sendDeleteAccountVerification:", error)
          throw error
        }
      }
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // Send password reset mail
    sendResetPassword: async ({ user, url }) => {
      try {
        const emailHtml = getResetPasswordEmailHtml(user.email, url)

        const { data, error } = await sendMail({
          sendTo: user.email,
          subject: "Reset Your Password",
          htmlContent: emailHtml
        });

        if (error) {
          console.error("Failed to send reset password email:", error)
          throw new Error("Failed to send reset password email")
        }
        console.log("Reset password email sent successfully to:", user.email)
        console.log("Email data:", data)

        // In development, also log the URL for easy testing
        if (envServer.NODE_ENV === "development") {
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
        // TODO: SEND DYANAMIC URL BASED ON ACCESS DOMAIN
        // const appUrl = envServer.NEXT_PUBLIC_APP_URL;
        const appUrl = "";
        const emailHtml = getPasswordResetSuccessEmailHtml(user.email, appUrl);

        const { data, error } = await sendMail({
          sendTo: user.email,
          subject: "Password Reset Successful",
          htmlContent: emailHtml
        });

        if (error) {
          console.error("Failed to send password reset success email:", error);
          throw new Error("Failed to send password reset success email");
        }

        console.log("Password reset success email sent to:", user.email);
        console.log("Email data:", data);
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

        // In development, also log the URL for easy testing
        if (envServer.NODE_ENV === "development") {
          console.log("verification URL (dev only):", url)
        }

        // Send the email
        const { data, error } = await sendMail({
          sendTo: user.email,
          subject: "Verify Email",
          htmlContent: emailHtml
        });

        if (error) {
          console.error("Failed to send verification password email:", error)
          throw new Error("Failed to send verification password email")
        }
        console.log("Verification password email sent successfully to:", user.email)
        console.log("Email ID:", data?.id)
      } catch (error) {
        console.error("Error in sendVerificationMail:", error)
        throw error
      }
    },
    afterEmailVerification: async (user) => {
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
      clientId: envServer.GOOGLE_CLIENT_ID as string,
      clientSecret: envServer.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: envServer.DISCORD_CLIENT_ID as string,
      clientSecret: envServer.DISCORD_CLIENT_SECRET as string,
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
    twoFactor(),
    customSession(async ({ user, session }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          contactNo: true,
          address: true,
          twoFactorEnabled: true,

          // current session context
          sessions: {
            where: { id: session.id },
            select: {
              activeBusinessId: true,
            },
            take: 1,
          },

          // user preferences
          userSettings: {
            select: {
              currency: true,
              dateFormat: true,
              defaultPayment: true,
              theme: true,
            },
          },
        },
      })

      const activeBusinessId = dbUser?.sessions?.[0]?.activeBusinessId ?? null
      const settings = dbUser?.userSettings

      return {
        session: {
          ...session,
          activeBusinessId,

          userSettings: {
            currency: settings?.currency ?? Currency.INR,
            dateFormat: settings?.dateFormat ?? "DD/MM/YYYY",
            defaultPayment: settings?.defaultPayment ?? PaymentMode.CASH,
            theme: settings?.theme ?? ThemeMode.AUTO,
          },
        },

        user: {
          ...user,
          contactNo: dbUser?.contactNo,
          address: dbUser?.address,
          twoFactorEnabled: dbUser?.twoFactorEnabled ?? false,
        },
      }
    }),
    lastLoginMethod(),
    admin({
      defaultRole: "user"
    })
  ]
});

export type Auth = typeof auth;

export const getUserSession = async () => {
  return await auth.api.getSession({
    headers: await headers()
  });
};
