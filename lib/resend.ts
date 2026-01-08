import { Resend } from "resend"

// Initialize Resend with API key from environment variables
export const resend = new Resend(process.env.RESEND_API_KEY || "fake_api_key")

// Default sender email - use your verified domain in production
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

console.log("Resend ENV is :", process.env.RESEND_API_KEY)
