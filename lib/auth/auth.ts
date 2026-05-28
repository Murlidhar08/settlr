// Packages
import { passkey } from "@better-auth/passkey";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin, customSession, haveIBeenPwned, lastLoginMethod, multiSession, twoFactor, username } from "better-auth/plugins";
import { redirect } from "next/navigation";

// Lib
import { sendMail } from "../nodemailer";
import { prisma } from "../prisma/prisma";

// Template
import { headers } from "next/headers";
import { envServer } from "../env.server";
import { ThemeMode } from "../generated/prisma/enums";
import { getDeleteAccountEmailHtml } from "../templates/email-delete-account";
import { getPasswordResetSuccessEmailHtml } from "../templates/email-password-reseted";
import { getResetPasswordEmailHtml } from "../templates/email-reset-password";
import { getVerificationEmailHtml } from "../templates/email-verification";

export const auth = betterAuth({
  appName: envServer.NEXT_PUBLIC_APP_NAME,
  baseURL: envServer.BETTER_AUTH_URL,
  secret: envServer.BETTER_AUTH_SECRET,
  errorPage: "/error",
  trustedOrigins: [
    envServer.BETTER_AUTH_URL,
    ...(envServer.BETTER_AUTH_TRUSTED_ORIGINS ? envServer.BETTER_AUTH_TRUSTED_ORIGINS.split(",") : []),
  ],
  advanced: {
    disableOriginCheck: true
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql",
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
      }
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
        const appUrl = envServer.BETTER_AUTH_URL;
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
      console.log(`${user.email} has been successfully verified!`);
    }
  },
  socialProviders: {
    ...(envServer.GOOGLE_CLIENT_ID && envServer.GOOGLE_CLIENT_SECRET ? {
      google: {
        clientId: envServer.GOOGLE_CLIENT_ID as string,
        clientSecret: envServer.GOOGLE_CLIENT_SECRET as string,
      }
    } : {}),
    ...(envServer.DISCORD_CLIENT_ID && envServer.DISCORD_CLIENT_SECRET ? {
      discord: {
        clientId: envServer.DISCORD_CLIENT_ID as string,
        clientSecret: envServer.DISCORD_CLIENT_SECRET as string,
      }
    } : {}),
    ...(envServer.FACEBOOK_CLIENT_ID && envServer.FACEBOOK_CLIENT_SECRET ? {
      facebook: {
        clientId: envServer.FACEBOOK_CLIENT_ID as string,
        clientSecret: envServer.FACEBOOK_CLIENT_SECRET as string,
      }
    } : {}),
  },
  session: {
    cookieCache: {
      enabled: false,
    }
  },
  plugins: [
    adminPlugin(),
    nextCookies(),
    twoFactor(),
    lastLoginMethod(),
    passkey(),
    customSession(async ({ user, session }) => {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          contactNo: true,
          address: true,
          twoFactorEnabled: true,
          role: true,
          banned: true,
          banReason: true,
          status: true,

          // current session context
          sessions: {
            where: { id: session.id },
            select: {
              id: true,
              impersonatedBy: true
            },
            take: 1,
          },

          // user preferences
          userSettings: {
            select: {
              dateFormat: true,
              timeFormat: true,
              language: true,
              theme: true,
            },
          },
        },
      })

      const settings = dbUser?.userSettings;
      const dbSession = dbUser?.sessions[0];

      return {
        session: {
          ...session,
          impersonatedBy: dbSession?.impersonatedBy ?? null,

          userSettings: {
            dateFormat: settings?.dateFormat ?? "dd/MM/yyyy",
            timeFormat: settings?.timeFormat ?? "hh:mm a",
            language: settings?.language ?? "en",
            theme: settings?.theme ?? ThemeMode.AUTO,
          },
        },

        user: {
          ...user,
          status: dbUser?.status,
          role: dbUser?.role,
          contactNo: dbUser?.contactNo,
          address: dbUser?.address,
          twoFactorEnabled: dbUser?.twoFactorEnabled ?? false,
          banned: dbUser?.banned ?? false,
          banReason: dbUser?.banReason ?? null,
        },
      }
    }),
    multiSession({
      maximumSessions: 3,
    }),
    haveIBeenPwned({
      enabled: envServer.NODE_ENV === 'production',
      customPasswordCompromisedMessage: "This password has appeared in data breaches. Please choose a stronger, unique password."
    }),
    username()
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Peform any action after user is added to database
          console.log(`New user created: ${user.email}`);
        },
      },
    }
  }
});

export type Auth = typeof auth;
export const getUserSession = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session == null) {
    redirect("/login" as any);
  }

  return session;
};
