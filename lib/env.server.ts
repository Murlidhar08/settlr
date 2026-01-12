import zod from "zod";

const envSchema = zod.object({
  // Application
  NODE_ENV: zod.string().nonempty(),

  //  Database
  DATABASE_URL: zod.string().nonempty(),

  //  Better Auth
  BETTER_AUTH_SECRET: zod.string().nonempty(),
  BETTER_AUTH_URL: zod.string().nonempty(),
  NEXT_PUBLIC_APP_URL: zod.string().nonempty(),

  //  Resend Email Service
  RESEND_API_KEY: zod.string().nonempty(),
  RESEND_FROM_EMAIL: zod.string().nonempty(),

  //  Google login
  GOOGLE_CLIENT_ID: zod.string(),
  GOOGLE_CLIENT_SECRET: zod.string(),

  //  Discord
  DISCORD_CLIENT_ID: zod.string(),
  DISCORD_CLIENT_SECRET: zod.string()
})

export const envServer = envSchema.parse(process.env)
