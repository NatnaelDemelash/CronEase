export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
        Welcome to <span className="text-primary">CronEase</span>!
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground">
        Stop guessing. Describe your schedule in plain English and let our AI
        generate the perfect cron expression for you.
      </p>
    </section>
  );
}
