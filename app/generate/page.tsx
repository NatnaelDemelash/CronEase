"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Loader, Loader2, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Mode = "generate" | "explain";

export default function GenerateCronPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<Mode>("generate");
  const [result, setResult] = useState<null | {
    cron: string;
    explanation: string;
    runs: string[];
  }>(null);
  const [history, setHistory] = useState<
    {
      query: string;
      mode: Mode;
      result: { cron: string; explanation: string; runs: string[] };
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

  // --- mock handlers (your API will replace these)
  const mockGenerate = (natural: string) => ({
    cron: natural.toLowerCase().includes("every 5")
      ? "*/5 * * * *"
      : natural.toLowerCase().includes("2pm")
      ? "0 14 * * *"
      : natural.toLowerCase().includes("monday")
      ? "0 9 * * 1"
      : "0 9 * * 1",
    explanation: natural.toLowerCase().includes("every 5")
      ? "Runs every 5 minutes."
      : natural.toLowerCase().includes("2pm")
      ? "Runs every day at 2:00 PM."
      : natural.toLowerCase().includes("monday")
      ? "Runs every Monday at 9:00 AM."
      : "This cron runs every Monday at 9:00 AM.",
    runs: [
      "Mon Sep 8 09:00:00",
      "Mon Sep 15 09:00:00",
      "Mon Sep 22 09:00:00",
      "Mon Sep 29 09:00:00",
      "Mon Oct 6 09:00:00",
      "Mon Oct 13 09:00:00",
      "Mon Oct 20 09:00:00",
      "Mon Oct 27 09:00:00",
      "Mon Nov 3 09:00:00",
      "Mon Nov 10 09:00:00",
    ],
  });

  const mockExplain = (cron: string) => ({
    cron,
    explanation:
      cron === "*/5 * * * *"
        ? "Runs every 5 minutes."
        : cron === "0 14 * * *"
        ? "Runs every day at 2:00 PM."
        : cron === "0 9 * * 1"
        ? "Runs every Monday at 9:00 AM."
        : "This cron runs every Monday at 9:00 AM.",
    runs: [
      "Mon Sep 8 09:00:00",
      "Mon Sep 15 09:00:00",
      "Mon Sep 22 09:00:00",
      "Mon Sep 29 09:00:00",
      "Mon Oct 6 09:00:00",
      "Mon Oct 13 09:00:00",
      "Mon Oct 20 09:00:00",
      "Mon Oct 27 09:00:00",
      "Mon Nov 3 09:00:00",
      "Mon Nov 10 09:00:00",
    ],
  });

  // --- submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", { query, mode });
    setLoading(true);
    setError("");

    if (!query.trim()) return;

    if (mode === "explain" && !isValidCron5(query)) {
      setError("Please enter a valid 5-field cron (e.g., */5 * * * *).");
      return;
    }

    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "generate" ? { natural: query } : { cron: query }
        ),
      });

      const data = await res.json();

      console.log("API response:", data);

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
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
    result: any;
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
    <section className="container mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold sm:text-4xl">
          {mode === "generate" ? "Generate a Cron" : "Explain a Cron"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {mode === "generate"
            ? "Type a plain English schedule below and let CronEase do the magic ✨"
            : "Paste a cron expression to get a plain English explanation and next run times."}
        </p>
      </div>

      {/* Mode toggle */}
      <div className="flex justify-center mb-6">
        <div className="flex rounded-md shadow-sm">
          <Button
            onClick={() => setMode("generate")}
            className={`rounded-r-none ${
              mode === "generate"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Plain English to Cron
          </Button>
          <Button
            onClick={() => setMode("explain")}
            className={`rounded-l-none ${
              mode === "explain"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Cron to Plain English
          </Button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl gap-2">
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
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : mode === "generate" ? (
            "Generate"
          ) : (
            "Explain"
          )}
        </Button>
      </form>

      {/* Presets */}
      <div className="mx-auto max-w-2xl mt-3 flex flex-wrap gap-2">
        {examplePresets[mode].map((p) => (
          <Button
            key={p}
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => handlePreset(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-auto max-w-2xl mt-4">
          <Card className="border-destructive/30">
            <CardContent className="text-destructive py-3 text-sm">
              {error}
            </CardContent>
          </Card>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center mt-6 space-y-2">
          <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
          <p className="text-gray-500 animate-pulse text-sm">
            Working on it...
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Main Results */}
          <div className="space-y-6 lg:col-span-2">
            {/* Cron */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {mode === "generate" ? "Cron Expression" : "Your Cron"}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Copy cron"
                  onClick={() => navigator.clipboard.writeText(result.cron)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {/* Pretty cron parts with tooltips */}
                <TooltipProvider>
                  <div className="flex flex-wrap gap-2">
                    {splitCron(result.cron).map((part, idx) => (
                      <Tooltip key={`${part}-${idx}`}>
                        <TooltipTrigger asChild>
                          <code className="rounded bg-muted px-2 py-1 font-mono text-sm text-primary cursor-help">
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Explanation</CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Copy explanation"
                  onClick={() =>
                    navigator.clipboard.writeText(result.explanation)
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.explanation}</p>
              </CardContent>
            </Card>
          </div>

          {/* Side: Next runs + History */}
          <div className="space-y-6 lg:col-span-1">
            {/* Next 10 runs */}
            <Card>
              <CardHeader>
                <CardTitle>Next 10 Runs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground max-h-48 overflow-y-auto">
                  {result.runs.map((run, i) => (
                    <li key={i}>{run}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <CardTitle>History</CardTitle>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label="Clear history"
                    onClick={clearHistory}
                    title="Clear history"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((item, i) => (
                      <li
                        key={`${item.query}-${i}`}
                        className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors"
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
    </section>
  );
}
