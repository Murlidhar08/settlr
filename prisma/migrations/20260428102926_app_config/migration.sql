-- CreateTable
CREATE TABLE "appConfig" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "appName" TEXT NOT NULL DEFAULT 'Settlr',
    "appDescription" TEXT NOT NULL DEFAULT 'Settlr for managing personal finance',
    "smtpHost" TEXT,
    "smtpPort" INTEGER DEFAULT 587,
    "smtpUser" TEXT,
    "smtpPass" TEXT,
    "smtpSecure" BOOLEAN DEFAULT false,
    "fromEmail" TEXT,
    "googleClientId" TEXT,
    "googleClientSecret" TEXT,
    "discordClientId" TEXT,
    "discordClientSecret" TEXT,

    CONSTRAINT "appConfig_pkey" PRIMARY KEY ("id")
);
