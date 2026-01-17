import zod from "zod";

const envSchema = zod.object({
  // Application
  NODE_ENV: zod.string().nonempty(),
  NEXT_PUBLIC_APP_NAME: zod.string().nonempty(),

  //  Database
  DATABASE_URL: zod.string().nonempty(),

  //  Better Auth
  BETTER_AUTH_SECRET: zod.string().nonempty(),
  BETTER_AUTH_URL: zod.string().nonempty(),

  //  Email Service
  SMTP_HOST: zod.string().nonempty(),
  SMTP_PORT: zod.string().nonempty(),
  SMTP_USER: zod.string().nonempty(),
  SMTP_PASS: zod.string().nonempty(),
  SMTP_SECURE: zod.string().nonempty(),
  FROM_EMAIL: zod.string().nonempty(),

  //  Google login
  GOOGLE_CLIENT_ID: zod.string(),
  GOOGLE_CLIENT_SECRET: zod.string(),

  //  Discord
  DISCORD_CLIENT_ID: zod.string(),
  DISCORD_CLIENT_SECRET: zod.string()
})

export const envServer = envSchema.parse(process.env)
