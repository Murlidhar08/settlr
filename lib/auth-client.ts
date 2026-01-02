import { createAuthClient } from "better-auth/react"
import { customSessionClient, twoFactorClient } from "better-auth/client/plugins";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [customSessionClient<typeof auth>()],
})

export const { signIn, signUp, useSession, signOut, resetPassword } = createAuthClient({
  plugins: [
    twoFactorClient()
  ]
});

// Google
export const signInWithGoogle = async () => {
  return await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard"
  });
};

// Discord
export const signInWithDiscord = async () => {
  return await authClient.signIn.social({
    provider: "discord",
    callbackURL: "/dashboard"
  })
}
