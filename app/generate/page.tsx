"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  Loader,
  Loader2,
  Trash2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Mode = "generate" | "explain";

// Define a type that accurately reflects the API response.
type ApiResponse = {
  ok: boolean;
  cron: string;
  explanation: string;
  nextRuns: string[];
};

export default function GenerateCronPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("generate");
  // Use the new ApiResponse type for the result state.
  const [result, setResult] = useState<null | ApiResponse>(null);
  const [history, setHistory] = useState<
    {
      query: string;
      mode: Mode;
      result: ApiResponse; // Use the new ApiResponse type for history items.
    }[]
  >([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- helpers
  const cronLabels = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
  const splitCron = (cron: string) => cron.trim().split(/\s+/);

  const isValidCron5 = (cron: string) => {
    // very light validator for 5-field crons (common format)
    const parts = splitCron(cron);
    if (parts.length !== 5) return false;
    const re = /^[\d*/,\-]+$/; // digits, *, /, -, , — simple but useful
    return parts.every((p) => re.test(p));
  };

  const examplePresets: Record<Mode, string[]> = {
    generate: [
      `Run every 5 minutes`,
      `Run every day at 2pm`,
      `Run every Monday at 9am`,
      `Run at 0 0 on 1st of month`,
    ],
    explain: [`*/5 * * * *`, `0 14 * * *`, `0 9 * * 1`, `0 0 1 * *`],
  };

  // --- submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { query, mode });
    setLoading(true);
    setError("");
    setResult(null);

    if (!query.trim()) return;

    if (mode === "explain" && !isValidCron5(query)) {
      setError("Please enter a valid 5-field cron (e.g., */5 * * * *).");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, mode }),
      });

      const data: ApiResponse = await res.json();

      console.log("API response:", data);

      if (!res.ok) {
        setError(data.explanation || "Something went wrong.");
        return;
      }

      setResult(data);
      setHistory((prev) => [
        { query, mode, result: data },
        ...prev.slice(0, 4),
      ]);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch result.");
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (item: {
    query: string;
    mode: Mode;
    result: ApiResponse; // Use the new ApiResponse type
  }) => {
    setQuery(item.query);
    setMode(item.mode);
    setResult(item.result);
    setError("");
  };

  const handlePreset = (preset: string) => {
    setQuery(preset);
    setError("");
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10 h-full w-full
        bg-[radial-gradient(circle_at_top_left,#e5e7eb_1px,transparent_1px)]
        [background-size:28px_28px]"
      ></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background/95 to-background"></div>

      <section className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">
            {mode === "generate" ? "Generate a Cron" : "Explain a Cron"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            {mode === "generate"
              ? "Type a plain English schedule below and let CronEase do the magic ✨"
              : "Paste a cron expression to get a plain English explanation and next run times."}
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center rounded-full bg-muted p-1 shadow-sm border">
            <Button
              onClick={() => setMode("generate")}
              variant="ghost"
              className={`rounded-full px-6 py-3 ${
                mode === "generate"
                  ? "bg-background shadow-sm border-2 border-primary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Plain English to Cron
            </Button>
            <Button
              onClick={() => setMode("explain")}
              variant="ghost"
              className={`rounded-full px-6 py-3 ${
                mode === "explain"
                  ? "bg-background shadow-sm border-2 border-primary text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Cron to Plain English
            </Button>
          </div>
        </div>

        {/* Form */}
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-primary/20 blur-xl"></div>
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-secondary/20 blur-xl"></div>

          <form onSubmit={handleSubmit} className="flex gap-3">
            <Input
              aria-label={
                mode === "generate" ? "Natural language input" : "Cron input"
              }
              placeholder={
                mode === "generate"
                  ? 'e.g. "Run every Monday at 9am"'
                  : 'e.g. "*/5 * * * *"'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 text-lg py-6"
            />
            <Button type="submit" disabled={loading} className="py-6 px-8">
              {loading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : mode === "generate" ? (
                "Generate"
              ) : (
                "Explain"
              )}
            </Button>
          </form>
        </div>

        {/* Presets */}
        <div className="mx-auto max-w-2xl mt-6 flex flex-wrap gap-3 justify-center">
          {examplePresets[mode].map((p) => (
            <Button
              key={p}
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => handlePreset(p)}
              className="rounded-lg"
            >
              {p}
            </Button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mx-auto max-w-2xl mt-6">
            <Card className="border-destructive/30 bg-destructive/10">
              <CardContent className="text-destructive py-4 text-sm">
                {error}
              </CardContent>
            </Card>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center mt-10 space-y-3">
            <div className="relative">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm"></div>
            </div>
            <p className="text-muted-foreground animate-pulse text-base">
              Working on it...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && result && (
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {/* Main Results */}
            <div className="space-y-6 lg:col-span-2">
              {/* Cron */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 py-4">
                  <CardTitle className="text-xl flex items-center">
                    {mode === "generate" ? "Cron Expression" : "Your Cron"}
                  </CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy cron"
                    onClick={() => navigator.clipboard.writeText(result.cron)}
                    className="h-9 w-9"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {/* Pretty cron parts with tooltips */}
                  <TooltipProvider>
                    <div className="flex flex-wrap gap-3">
                      {splitCron(result.cron).map((part, idx) => (
                        <Tooltip key={`${part}-${idx}`}>
                          <TooltipTrigger asChild>
                            <code className="rounded-lg bg-muted px-3 py-2 font-mono text-base text-primary cursor-help border border-border/50 shadow-sm">
                              {part}
                            </code>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{cronLabels[idx] ?? `Field ${idx + 1}`}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </TooltipProvider>
                </CardContent>
              </Card>

              {/* Explanation */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/30 py-4">
                  <CardTitle className="text-xl">Explanation</CardTitle>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy explanation"
                    onClick={() =>
                      navigator.clipboard.writeText(result.explanation)
                    }
                    className="h-9 w-9"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-base leading-relaxed">
                    {result.explanation}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Side: Next runs + History */}
            <div className="space-y-6 lg:col-span-1">
              {/* Next 10 runs */}
              <Card className="border-border/50 shadow-lg">
                <CardHeader className="bg-muted/30 py-4">
                  <CardTitle className="text-xl">Next 10 Runs</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
                    {result.nextRuns.map((run: string, i: number) => (
                      <li
                        key={i}
                        className="text-muted-foreground font-mono py-1 px-2 rounded-md bg-muted/30"
                      >
                        {run}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* History */}
              {history.length > 0 && (
                <Card className="border-border/50 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between bg-muted/30 py-4">
                    <CardTitle className="text-xl">History</CardTitle>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Clear history"
                      onClick={clearHistory}
                      title="Clear history"
                      className="h-9 w-9"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 max-h-48 overflow-y-auto">
                      {history.map((item, i) => (
                        <li
                          key={`${item.query}-${i}`}
                          className="cursor-pointer p-3 rounded-md hover:bg-muted/50 transition-colors border border-border/30"
                          onClick={() => handleHistoryClick(item)}
                        >
                          <p className="text-sm font-medium truncate">
                            {item.query}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.mode === "generate"
                              ? "English to Cron"
                              : "Cron to English"}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* CTA Section */}
        {!result && !loading && (
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold">
              Start simplifying your cron expressions today
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
              No more syntax headaches. Just describe your schedule and get the
              perfect cron expression.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
