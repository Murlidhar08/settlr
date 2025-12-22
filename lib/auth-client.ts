import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
})

export const { signIn, signUp, useSession, signOut, resetPassword } = createAuthClient();

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