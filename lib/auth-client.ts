import { createAuthClient } from "better-auth/react"
import { adminClient, customSessionClient, inferAdditionalFields, lastLoginMethodClient, twoFactorClient } from "better-auth/client/plugins"
import { Auth } from "./auth";
import { ac, admin, user } from "./permissions";
import { hasExternalOtelApiPackage } from "next/dist/build/webpack-config";

/**
 * Single source of truth for auth client
 */
export const authClient = createAuthClient({
  plugins: [
    customSessionClient<Auth>(),
    inferAdditionalFields<Auth>(),
    twoFactorClient({
      onTwoFactorRedirect: () => {
        window.location.href = "/two-factor"
      },
    }),
    lastLoginMethodClient(),
    adminClient()
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
