import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <Link to="/login" className="text-sm font-medium text-primary hover:underline">
            &larr; Back to login
          </Link>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <p>
            Your privacy is important to us. It is ClientFlow AI's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">1. Information We Collect</h2>
          <p>
            We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. We also let you know why we're collecting it and how it will be used.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">2. Use of Information</h2>
          <p>
            The information we collect is used to provide, maintain, protect and improve our services, to develop new ones, and to protect ClientFlow AI and our users.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">3. Data Retention</h2>
          <p>
            We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">4. Sharing of Data</h2>
          <p>
            We don't share any personally identifying information publicly or with third-parties, except when required to by law.
          </p>
          <p className="pt-8 text-sm">Last updated: August 2026</p>
        </div>
      </div>
    </div>
  );
}
