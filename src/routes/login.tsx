import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — ClientFlow AI" },
      { name: "description", content: "Sign in to ClientFlow AI to manage leads, AI pitches and Gmail outreach." },
      { property: "og:title", content: "Sign in — ClientFlow AI" },
      { property: "og:description", content: "Access your AI outreach workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { user, ready, signInWithGoogle, sendMagicLink, verifyMagicLink } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (ready && user) navigate({ to: "/dashboard" });
  }, [ready, user, navigate]);

  useEffect(() => {
    // Check if coming back from email link
    const url = window.location.href;
    if (url.includes("apiKey") && url.includes("oobCode")) {
      let savedEmail = window.localStorage.getItem("emailForSignIn");
      if (!savedEmail) {
        savedEmail = window.prompt("Please provide your email for confirmation");
      }
      if (savedEmail) {
        verifyMagicLink(savedEmail, url)
          .then(() => {
            toast.success("Successfully signed in with email!");
            navigate({ to: "/dashboard" });
          })
          .catch((error) => {
            toast.error("Error signing in with email link", { description: error.message });
          });
      }
    }
  }, [verifyMagicLink, navigate]);

  const handleMagicLink = async () => {
    if (!email) {
      toast.error("Please enter your email address first.");
      return;
    }
    try {
      setIsSending(true);
      await sendMagicLink(email);
      toast.success("Magic link sent! Please check your email.");
    } catch (error: any) {
      toast.error("Failed to send link", { description: error.message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="relative flex flex-col justify-center px-6 py-8 sm:px-12 xl:px-24 2xl:px-32">
        <div className="mx-auto w-full max-w-sm 2xl:max-w-md">
          <div className="flex items-center gap-2">
            <div className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg 2xl:size-10">
              <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl"></div>
              <Sparkles className="relative z-10 size-4 2xl:size-5" aria-hidden />
            </div>
            <span className="text-lg font-bold tracking-tight 2xl:text-xl">ClientFlow AI</span>
          </div>

          <div className="mt-8 2xl:mt-12">
            <h1 className="text-2xl font-bold tracking-tight text-foreground 2xl:text-3xl">
              Welcome
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in or create an account to start finding leads, analyzing websites, and automating your agency's outreach.
            </p>
          </div>

          <div className="mt-6 2xl:mt-8">
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button
                className="w-full h-11 text-base font-medium"
                onClick={handleMagicLink}
                disabled={isSending}
              >
                {isSending ? "Sending link..." : "Continue with Email"}
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="relative w-full h-11 text-base font-medium shadow-sm transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              onClick={async () => {
                try {
                  await signInWithGoogle();
                  navigate({ to: "/dashboard" });
                } catch (err: any) {
                  if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
                    toast.error("Sign in failed", { description: err.message });
                  }
                }
              }}
            >
              <svg className="mr-3 size-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
          </div>



          <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
            and{" "}
            <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </section>

      <section className="relative hidden flex-col justify-center overflow-hidden border-l bg-primary px-8 py-6 lg:flex xl:px-16 2xl:px-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90 dark:opacity-20" />
        <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-accent opacity-20 blur-[120px] 2xl:h-[700px] 2xl:w-[700px] 2xl:blur-[160px]" />
        <div className="absolute -right-48 bottom-0 h-[500px] w-[500px] rounded-full bg-background opacity-20 blur-[120px] 2xl:h-[700px] 2xl:w-[700px] 2xl:blur-[160px]" />
        
        <div className="relative z-10 mx-auto w-full max-w-lg 2xl:max-w-xl text-primary-foreground">
          <h2 className="text-2xl leading-tight font-bold tracking-tight 2xl:text-3xl">
            Turn weak websites into a qualified pipeline.
          </h2>
          <ul className="mt-6 space-y-4 2xl:mt-8 2xl:space-y-5">
            {[
              ["Automatic website analysis", "Detect missing, outdated, slow or non-responsive websites at scale."],
              ["AI pitches with real context", "Every email references a concrete observation about the business."],
              ["Gmail-native sending", "Human-paced delivery from your own inbox, with reply detection built in."],
              ["Intelligent follow-ups", "Automatically pause sequences when a prospect replies."],
              ["Lead scoring", "Prioritize the businesses most likely to need your web services."],
            ].map(([title, copy]) => (
              <li key={title} className="flex gap-3 2xl:gap-4">
                <div className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20 2xl:size-5">
                  <div className="size-1 rounded-full bg-primary-foreground 2xl:size-1.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold 2xl:text-base">{title}</p>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed 2xl:text-sm">{copy}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-primary-foreground/10 bg-primary-foreground/5 p-4 backdrop-blur-sm 2xl:mt-8 2xl:p-6">
            <div className="flex gap-1 text-accent">
              {[...Array(5)].map((_, i) => (
                <svg key={i} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="2xl:h-4 2xl:w-4">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="mt-2 text-xs font-medium leading-relaxed text-primary-foreground/90 2xl:mt-3 2xl:text-sm 2xl:leading-relaxed">
              "ClientFlow completely changed how we do outreach. We used to spend hours analyzing websites manually. Now, we just upload a list and the AI handles the rest. Our reply rate tripled in the first month."
            </p>
            <div className="mt-3 flex items-center gap-3 2xl:mt-4">
              <div className="size-6 rounded-full bg-primary-foreground/20 2xl:size-8" />
              <div>
                <p className="text-xs font-semibold text-primary-foreground 2xl:text-sm">Sarah Jenkins</p>
                <p className="text-[10px] text-primary-foreground/70 2xl:text-xs">Founder, Apex Web Studio</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
