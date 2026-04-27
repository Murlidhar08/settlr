import { prisma } from "./prisma/prisma";
import { envServer } from "./env.server";

export async function getAppConfig() {
  try {
    let config = await prisma.appConfig.findUnique({
      where: { id: "singleton" }
    });

    if (!config) {
      // Create initial config from environment variables
      config = await prisma.appConfig.create({
        data: {
          id: "singleton",
          appName: envServer.NEXT_PUBLIC_APP_NAME || "Settlr",
          appDescription: envServer.NEXT_PUBLIC_APP_DESCRIPTION || "Settlr for managing personal finance",
          smtpHost: envServer.SMTP_HOST,
          smtpPort: parseInt(envServer.SMTP_PORT || "587"),
          smtpUser: envServer.SMTP_USER,
          smtpPass: envServer.SMTP_PASS,
          smtpSecure: envServer.SMTP_SECURE === "true",
          fromEmail: envServer.FROM_EMAIL,
          googleClientId: envServer.GOOGLE_CLIENT_ID,
          googleClientSecret: envServer.GOOGLE_CLIENT_SECRET,
          discordClientId: envServer.DISCORD_CLIENT_ID,
          discordClientSecret: envServer.DISCORD_CLIENT_SECRET
        }
      });
    }

    return config;
  } catch (error) {
    console.error("Error fetching app config:", error);
    // Fallback to environment variables if DB fails
    return {
      appName: envServer.NEXT_PUBLIC_APP_NAME || "Settlr",
      appDescription: envServer.NEXT_PUBLIC_APP_DESCRIPTION || "Settlr for managing personal finance",
      smtpHost: envServer.SMTP_HOST || "",
      smtpPort: parseInt(envServer.SMTP_PORT || "587"),
      smtpUser: envServer.SMTP_USER || "",
      smtpPass: envServer.SMTP_PASS || "",
      smtpSecure: envServer.SMTP_SECURE === "true",
      fromEmail: envServer.FROM_EMAIL || "",
      googleClientId: envServer.GOOGLE_CLIENT_ID || "",
      googleClientSecret: envServer.GOOGLE_CLIENT_SECRET || "",
      discordClientId: envServer.DISCORD_CLIENT_ID || "",
      discordClientSecret: envServer.DISCORD_CLIENT_SECRET || ""
    };
  }
}
