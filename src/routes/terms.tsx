import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link to="/login" className="text-sm font-medium text-primary hover:underline">
            &larr; Back to login
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Terms of Service</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Welcome to ClientFlow AI. These Terms of Service govern your use of our website and services.
            By accessing or using ClientFlow AI, you agree to be bound by these terms.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">1. Use of Service</h2>
          <p>
            You agree to use our services only for lawful purposes and in accordance with these Terms.
            You must not use the services to send spam, unsolicited communications, or for any malicious activities.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">2. Account Registration</h2>
          <p>
            To use certain features, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">3. Intellectual Property</h2>
          <p>
            The services and its original content, features, and functionality are owned by ClientFlow AI and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">4. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the services immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p className="pt-8 text-sm">Last updated: August 2026</p>
        </div>
      </div>
    </div>
  );
}
