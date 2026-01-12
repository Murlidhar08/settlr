import zod from "zod";

const envClientSchema = zod.object({
  NEXT_PUBLIC_APP_URL: zod.string(),
})

export const envClient = envClientSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
})
