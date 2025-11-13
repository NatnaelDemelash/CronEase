import { ExternalLink } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
  return (
    <section className="container mx-auto max-w-4xl px-4 py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        How CronEase Works
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        CronEase is a straightforward tool that helps you generate, understand,
        and preview cron expressions without needing to memorize a single line
        of complex syntax.
      </p>

      <div className="mt-12 space-y-12">
        {/* Step 1 */}
        <div className="flex items-start gap-6">
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
            1
          </span>
          <div>
            <h2 className="text-2xl font-semibold">
              Describe in Plain English
            </h2>
            <p className="mt-2 text-muted-foreground">
              Just type what you need in simple, everyday language. For example:
              <br />
              <code className="inline-block mt-2 rounded border bg-muted px-2 py-1 text-sm text-foreground hover:bg-muted/80 transition-colors">
                every day at 2pm
              </code>
              <code className="inline-block ml-2 rounded border bg-muted px-2 py-1 text-sm text-foreground hover:bg-muted/80 transition-colors">
                run every 5 minutes
              </code>
            </p>
          </div>
        </div>

        {/* Separator */}
        <div className="border-l-2 border-dashed h-8 ml-[19px] sm:ml-[19px]"></div>

        {/* Step 2 */}
        <div className="flex items-start gap-6">
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
            2
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Get the Cron Expression</h2>
            <p className="mt-2 text-muted-foreground">
              Our AI instantly translates your request into the correct cron
              expression.
            </p>
            <pre className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm font-mono text-primary-foreground/90">
              <span className="block text-primary-foreground">
                {'"Run every day at 2pm"'}
              </span>
              <span className="block text-primary">➡ 0 14 * * *</span>
            </pre>
          </div>
        </div>

        {/* Separator */}
        <div className="border-l-2 border-dashed h-8 ml-[19px] sm:ml-[19px]"></div>

        {/* Step 3 */}
        <div className="flex items-start gap-6">
          <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
            3
          </span>
          <div>
            <h2 className="text-2xl font-semibold">Understand & Preview</h2>
            <p className="mt-2 text-muted-foreground">
              CronEase provides a plain-English explanation and shows you the
              next 10 upcoming run times, so you can be completely confident the
              expression is correct.
            </p>
          </div>
        </div>
      </div>

      {/* Pro Tip Callout */}
      <div className="mt-16 rounded-lg border-l-4 border-primary bg-primary/10 p-6 text-sm text-muted-foreground">
        <h3 className="font-semibold text-primary">Pro Tip</h3>
        <p className="mt-2">
          Want to learn more about the cron syntax? Check out our detailed
          documentation on{" "}
          <Link
            href="/docs/cron-syntax"
            className="text-primary hover:underline inline-flex items-center"
          >
            Cron Syntax <ExternalLink size={14} className="ml-1" />
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
