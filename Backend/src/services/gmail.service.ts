import { getGmailOAuth2Client } from "../config/gmail";
import { supabase } from "../config/supabase";

const SCOPES = [
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.readonly",
];

export class GmailService {
  /**
   * Generates the Google OAuth consent URL.
   */
  static generateAuthUrl(firebaseUid: string): string {
    const oauth2Client = getGmailOAuth2Client();

    // Generate the URL that will be used for authorization
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: SCOPES,
      state: firebaseUid, // Pass the user's UID in state to link the callback
    });

    return url;
  }

  /**
   * Handles the OAuth callback and stores tokens securely.
   */
  static async handleCallback(code: string, firebaseUid: string): Promise<void> {
    const oauth2Client = getGmailOAuth2Client();
    
    // Exchange the authorization code for an access token
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token) {
      throw new Error("No access token received from Google");
    }

    // Get the user's email from the token info to save it
    oauth2Client.setCredentials(tokens);
    // In a real app, you would fetch their email address via the Gmail API here to verify

    // Store tokens in Supabase securely against the user's profile
    // Assuming a `user_profiles` or similar table with `firebase_uid`, `gmail_access_token`, `gmail_refresh_token`
    const { error } = await supabase
      .from("user_profiles")
      .upsert({
        firebase_uid: firebaseUid,
        gmail_access_token: tokens.access_token, // Ideally, these should be encrypted before storing
        gmail_refresh_token: tokens.refresh_token,
        gmail_connected_at: new Date().toISOString(),
      }, { onConflict: "firebase_uid" });

    if (error) {
      throw new Error("Failed to store Gmail tokens: " + error.message);
    }
  }

  static async getStatus(firebaseUid: string) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("gmail_connected_at, gmail_email") // Assuming these columns exist
      .eq("firebase_uid", firebaseUid)
      .single();

    if (error || !data?.gmail_connected_at) {
      return { connected: false };
    }

    return {
      connected: true,
      account: data.gmail_email || "Connected Account",
      connectedAt: data.gmail_connected_at,
    };
  }

  static async disconnect(firebaseUid: string): Promise<void> {
    await supabase
      .from("user_profiles")
      .update({
        gmail_access_token: null,
        gmail_refresh_token: null,
        gmail_connected_at: null,
        gmail_email: null,
      })
      .eq("firebase_uid", firebaseUid);
  }
}
