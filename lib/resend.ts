import { Resend } from "resend"
import { env } from "./env"

// Initialize Resend with API key from environment variables
export const resend = new Resend(env.RESEND_API_KEY);

// Default sender email - use your verified domain in production
export const FROM_EMAIL = env.RESEND_FROM_EMAIL;
