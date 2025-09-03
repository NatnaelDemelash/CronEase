import Link from "next/link";
import { Clock, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full 
        bg-[radial-gradient(circle_at_top_left,#e5e7eb_1px,transparent_1px)] 
        [background-size:28px_28px]"
      ></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background"></div>

      {/* Hero Content */}
      <div className="container flex flex-col items-center justify-center gap-6 px-4 pt-24 text-center">
        <h1 className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl leading-tight">
          Cron Expressions{" "}
          <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            Made Simple
          </span>
        </h1>

        <p className="max-w-2xl text-balance text-base sm:text-lg text-muted-foreground">
          No more syntax headaches. Just describe your schedule in plain English
          and let CronEase generate the perfect cron expression — with
          explanations and next run times.
        </p>

        {/* CTA buttons */}
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/generate"
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-md transition-transform hover:scale-105"
          >
            Generate Cron
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-6 text-sm font-medium shadow-sm transition-transform hover:scale-105"
          >
            How It Works
          </Link>
        </div>

        {/* Example Preview */}
        <div className="mt-10 w-full max-w-3xl rounded-xl border bg-muted/30 p-6 text-left shadow-sm">
          <p className="text-sm text-muted-foreground">Example:</p>
          <pre className="mt-2 overflow-x-auto rounded-md bg-background p-4 text-sm font-mono text-primary shadow-inner">
            {`"Run every Monday at 9am"
➡ 0 9 * * 1`}
          </pre>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mt-20 grid gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
          <Sparkles className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Plain English → Cron</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Type schedules like “every 5 minutes” and let AI handle the rest.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
          <BookOpen className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Clear Explanations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Understand what each cron means in simple words.
          </p>
        </div>
        <div className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
          <Clock className="h-8 w-8 text-primary" />
          <h3 className="mt-3 font-semibold">Next Run Times</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Instantly preview the upcoming 10 execution times.
          </p>
        </div>
      </div>
    </section>
  );
}
