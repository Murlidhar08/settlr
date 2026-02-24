// Packages
import { betterAuth } from "better-auth";
import { cache } from "react";

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
import { Currency, ThemeMode, FinancialAccountType, MoneyType, CategoryType } from "./generated/prisma/enums";
import { envServer } from "./env.server";

export const auth = betterAuth({
  appName: envServer.NEXT_PUBLIC_APP_NAME,
  baseURL: envServer.BETTER_AUTH_URL,
  secret: envServer.BETTER_AUTH_SECRET,
  trustedOrigins: [
    envServer.BETTER_AUTH_URL,
    ...(envServer.BETTER_AUTH_TRUSTED_ORIGINS ? envServer.BETTER_AUTH_TRUSTED_ORIGINS.split(",") : []),
  ],
  advanced: {
    disableOriginCheck: true
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql"
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
      activeBusinessId: {
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
          activeBusinessId: true,
          twoFactorEnabled: true,

          // current session context
          sessions: {
            where: { id: session.id },
            select: {
              id: true,
            },
            take: 1,
          },

          // user preferences
          userSettings: {
            select: {
              currency: true,
              dateFormat: true,
              timeFormat: true,
              language: true,
              theme: true,
            },
          },
        },
      })

      const activeBusinessId = dbUser?.activeBusinessId ?? null
      const settings = dbUser?.userSettings

      return {
        session: {
          ...session,

          userSettings: {
            currency: settings?.currency ?? Currency.INR,
            dateFormat: settings?.dateFormat ?? "dd/MM/yyyy",
            timeFormat: settings?.timeFormat ?? "hh:mm a",
            language: settings?.language ?? "en",
            theme: settings?.theme ?? ThemeMode.AUTO,
          },
        },

        user: {
          ...user,
          activeBusinessId: activeBusinessId,
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
  ],
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (!user?.id) return;

          // Check if business already exists
          const existing = await prisma.business.findFirst({
            where: { ownerId: user.id }
          });

          if (existing) return;

          // Add Default Business with system accounts
          const defaultBusiness = await prisma.business.create({
            data: {
              name: `${user.name || "Default"} Business`,
              ownerId: user.id,
              financialAccounts: {
                create: [
                  {
                    name: "Cash",
                    type: FinancialAccountType.MONEY,
                    moneyType: MoneyType.CASH,
                    isSystem: true,
                  },
                  {
                    name: "Opening Balance",
                    type: FinancialAccountType.CATEGORY,
                    categoryType: CategoryType.ADJUSTMENT,
                    isSystem: true,
                  },
                  {
                    name: "Owner Withdrawal",
                    type: FinancialAccountType.CATEGORY,
                    categoryType: CategoryType.EQUITY,
                    isSystem: true,
                  },
                  {
                    name: "Owner Investment",
                    type: FinancialAccountType.CATEGORY,
                    categoryType: CategoryType.EQUITY,
                    isSystem: true,
                  },
                  {
                    name: "Expense",
                    type: FinancialAccountType.CATEGORY,
                    categoryType: CategoryType.EXPENSE,
                    isSystem: true,
                  },
                  {
                    name: "Sales",
                    type: FinancialAccountType.CATEGORY,
                    categoryType: CategoryType.INCOME,
                    isSystem: true,
                  },
                ]
              }
            }
          });

          // Set activeBusinessId for the new user
          await prisma.user.update({
            where: { id: user.id },
            data: { activeBusinessId: defaultBusiness.id }
          });
          console.log(`Default setup completed for new user: ${user.email}`);
        },
      },
    }
  }
});

export type Auth = typeof auth;

export const getUserSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers()
  });
});

