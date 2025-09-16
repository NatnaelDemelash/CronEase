import Link from "next/link";
import {
  Clock,
  BookOpen,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Users,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full
        bg-[radial-gradient(circle_at_top_left,#e5e7eb_1px,transparent_1px)]
        [background-size:28px_28px]"
      ></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background"></div>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden pt-24 pb-16">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl leading-tight">
                Cron Expressions{" "}
                <span className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="max-w-4xl text-balance text-lg sm:text-xl text-muted-foreground mt-6">
                No more syntax headaches. Just describe your schedule in plain
                English and let CronEase generate the perfect cron expression —
                with explanations and next run times.
              </p>

              {/* CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/generate"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-md transition-transform hover:scale-105"
                >
                  Get Started Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-3 text-base font-medium shadow-sm transition-transform hover:scale-105"
                >
                  How It Works
                </Link>
              </div>
            </div>
            <div className="flex-1">
              {/* Hero Illustration */}
              <div className="relative rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-xl">
                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/20 blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-secondary/20 blur-xl"></div>

                <div className="bg-background rounded-lg p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">Input:</p>
                  <div className="bg-muted rounded px-3 py-2 mb-4 text-sm">
                    "Run every Monday at 9am"
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">
                    Generated cron:
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-sm font-mono text-primary">
                    0 9 * * 1
                  </pre>

                  <div className="mt-4 flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    Next run: Monday, September 18, 2023 at 9:00 AM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">
              Powerful features for developers
            </h2>
            <p className="text-muted-foreground mt-4">
              Everything you need to work with cron expressions efficiently
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Plain English → Cron",
                desc: 'Type schedules like "every 5 minutes" and let AI handle the rest.',
              },
              {
                icon: BookOpen,
                title: "Clear Explanations",
                desc: "Understand what each cron means in simple words.",
              },
              {
                icon: Clock,
                title: "Next Run Times",
                desc: "Instantly preview the upcoming 10 execution times.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Generate expressions in milliseconds with our optimized engine.",
              },
              {
                icon: CheckCircle,
                title: "Validation Built-in",
                desc: "Never create invalid cron expressions again.",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                desc: "Share and save cron expressions with your team.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="group flex flex-col rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-lg hover:border-primary/20"
              >
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mx-auto">
                  <item.icon className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold">
            Ready to simplify your scheduling?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Cron expressions, without the complexity. Try CronEase today and
            make scheduling a breeze.
          </p>
          <div className="mt-8">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground shadow-md transition-transform hover:scale-105"
            >
              Start Generating Now
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo and brand */}
            <div className="flex items-center gap-3">
              {/* Clock-inspired logo */}
              <div className="relative h-10 w-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/70 rounded-full"></div>
                <div className="absolute h-4 w-0.5 bg-background rounded-full transform translate-y-1"></div>
                <div className="absolute h-2 w-0.5 bg-background rounded-full transform -translate-y-1 rotate-45"></div>
                <div className="absolute h-1.5 w-1.5 bg-background rounded-full"></div>
              </div>
              <div className="text-lg font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                CronEase
              </div>
            </div>

            <div className="flex gap-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-8">
            © {new Date().getFullYear()} CronEase. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
