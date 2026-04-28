import zod from "zod";

const envSchema = zod.object({
  // Application
  NODE_ENV: zod.string().nonempty(),
  NEXT_PUBLIC_APP_NAME: zod.string().nonempty(),
  NEXT_PUBLIC_APP_DESCRIPTION: zod.string().nonempty(),

  //  Database
  DATABASE_URL: zod.string().nonempty(),

  //  Better Auth
  BETTER_AUTH_SECRET: zod.string().nonempty(),
  BETTER_AUTH_URL: zod.string().nonempty(),
  BETTER_AUTH_TRUSTED_ORIGINS: zod.string().optional(),

  //  Email Service
  SMTP_HOST: zod.string().optional(),
  SMTP_PORT: zod.string().optional(),
  SMTP_USER: zod.string().optional(),
  SMTP_PASS: zod.string().optional(),
  SMTP_SECURE: zod.string().optional(),
  FROM_EMAIL: zod.string().optional(),

  //  Google login
  GOOGLE_CLIENT_ID: zod.string().optional(),
  GOOGLE_CLIENT_SECRET: zod.string().optional(),

  //  Discord
  DISCORD_CLIENT_ID: zod.string().optional(),
  DISCORD_CLIENT_SECRET: zod.string().optional()
})

/**
 * Note: Use getAppConfig() from @/lib/app-config to get the final merged
 * configuration (Database + Env Fallback). This envServer only validates
 * the base environment variables.
 */
export const envServer = envSchema.parse(process.env)
