import { initializeApp, cert, getApps, applicationDefault } from "firebase-admin/app";
import { env } from "./env";
import fs from "fs";
import path from "path";

// 1. Try to find the service-account.json file locally
const serviceAccountPath = path.resolve(__dirname, "../../service-account.json");

let credential;
if (fs.existsSync(serviceAccountPath)) {
  console.log("Found service-account.json, using it for Firebase Admin auth.");
  credential = cert(serviceAccountPath);
} else if (env.FIREBASE_PRIVATE_KEY && !env.FIREBASE_PRIVATE_KEY.includes("MOCK_KEY")) {
  console.log("Using FIREBASE_PRIVATE_KEY from .env for Firebase Admin auth.");
  let pk = env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");
  if (pk.startsWith('"') && pk.endsWith('"')) pk = pk.slice(1, -1);
  if (pk.startsWith("'") && pk.endsWith("'")) pk = pk.slice(1, -1);
  
  credential = cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: pk,
  });
} else {
  console.log("Falling back to Application Default Credentials for Firebase Admin auth.");
  credential = applicationDefault();
}

export const firebaseAdmin = 
  getApps().length === 0 
    ? initializeApp({
        credential,
        projectId: env.FIREBASE_PROJECT_ID,
      }) 
    : getApps()[0];
