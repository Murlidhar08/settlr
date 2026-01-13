import { Resend } from "resend"
import { envServer } from "./env.server"

// Initialize Resend with API key from environment variables
export const resend = new Resend(envServer.RESEND_API_KEY);

// Default sender email - use your verified domain in production
export const FROM_EMAIL = envServer.RESEND_FROM_EMAIL;
