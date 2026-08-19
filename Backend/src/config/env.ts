import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().default("5000"),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),

  FIREBASE_PROJECT_ID: z.string().min(1, "FIREBASE_PROJECT_ID is required"),
  FIREBASE_CLIENT_EMAIL: z.string().email("FIREBASE_CLIENT_EMAIL must be a valid email").optional().or(z.literal("")),
  FIREBASE_PRIVATE_KEY: z.string().optional().or(z.literal("")),

  SUPABASE_URL: z.string().url("SUPABASE_URL must be a valid URL"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  MISTRAL_API_KEY: z.string().min(1, "MISTRAL_API_KEY is required"),
  MISTRAL_MODEL: z.string().default("mistral-large-latest"),

  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required"),
  GOOGLE_CLIENT_SECRET: z.string().min(1, "GOOGLE_CLIENT_SECRET is required"),
  GOOGLE_REDIRECT_URI: z.string().url("GOOGLE_REDIRECT_URI must be a valid URL"),

  TOKEN_ENCRYPTION_KEY: z.string().min(32, "TOKEN_ENCRYPTION_KEY must be at least 32 characters long for AES-256"),
});

try {
  envSchema.parse(process.env);
  console.log("Environment configuration validated.");
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("Environment configuration is incomplete. Missing or invalid variables:");
    (error as any).errors.forEach((e: any) => {
      console.error(`- ${e.path.join(".")}: ${e.message}`);
    });
  } else {
    console.error("Environment configuration is incomplete.");
  }
  process.exit(1);
}

export const env = envSchema.parse(process.env);
