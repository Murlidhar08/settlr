import { createAuthClient } from "better-auth/react"
import { customSessionClient, inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins"
import { Auth } from "./auth";
import { envClient } from "./env.client";

/**
 * Single source of truth for auth client
 */
export const authClient = createAuthClient({
  baseURL: envClient.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<Auth>(),
    customSessionClient<Auth>(),
    twoFactorClient(),
  ],
})

/**
 * Re-export helpers for convenience
 */
export const { signIn, signUp, signOut, useSession, resetPassword } = authClient

/**
 * Social providers
 */
type SocialProvider = "google" | "discord"

export const signInWithSocial = async (provider: SocialProvider) => {
  return await authClient.signIn.social({
    provider,
    callbackURL: "/dashboard"
  })
}

export const signInWithGoogle = async () => await signInWithSocial("google");
export const signInWithDiscord = async () => await signInWithSocial("discord");
