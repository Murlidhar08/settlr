import zod from "zod";

const envClientSchema = zod.object({
  NEXT_PUBLIC_APP_NAME: zod.string(),
  NEXT_PUBLIC_APP_DESCRIPTION: zod.string(),
})

export const envClient = envClientSchema.parse({
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION
})
