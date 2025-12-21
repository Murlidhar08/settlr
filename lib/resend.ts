import { Resend } from "resend"

// Initialize Resend with API key from environment variables
export const resend = new Resend(process.env.RESEND_API_KEY)

// Default sender email - use your verified domain in production
export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"
