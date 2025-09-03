"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";

export default function GenerateCronPage() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"generate" | "explain">("generate");
  const [result, setResult] = useState<null | {
    cron: string;
    explanation: string;
    runs: string[];
  }>(null);
  const [history, setHistory] = useState<
    { query: string; mode: string; result: any }[]
  >([]);

  // Temporary mock handler
  const handleGenerate = () => {
    const newResult = {
      cron: "0 9 * * 1",
      explanation: "This cron runs every Monday at 9:00 AM.",
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
    };
    setResult(newResult);
    setHistory((prev) => [
      { query, mode, result: newResult },
      ...prev.slice(0, 4),
    ]); // Keep last 5 items
  };

  const handleExplain = () => {
    const newResult = {
      cron: query,
      explanation: "This cron runs every Monday at 9:00 AM.",
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
    };
    setResult(newResult);
    setHistory((prev) => [
      { query, mode, result: newResult },
      ...prev.slice(0, 4),
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "generate") {
      handleGenerate();
    } else {
      handleExplain();
    }
  };

  const handleHistoryClick = (item: {
    query: string;
    mode: string;
    result: any;
  }) => {
    setQuery(item.query);
    setMode(item.mode as "generate" | "explain");
    setResult(item.result);
  };

  return (
    <section className="container mx-auto px-4 py-16">
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

      <form onSubmit={handleSubmit} className="mx-auto flex max-w-2xl gap-2">
        <Input
          placeholder={
            mode === "generate"
              ? 'e.g. "Run every Monday at 9am"'
              : 'e.g. "0 9 * * 1"'
          }
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit">
          {mode === "generate" ? "Generate" : "Explain"}
        </Button>
      </form>

      {result && (
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Main Results */}
          <div className="space-y-6 lg:col-span-2">
            {/* Cron Result */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {mode === "generate" ? "Cron Expression" : "Your Cron"}
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => navigator.clipboard.writeText(result.cron)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="rounded bg-muted p-4 font-mono text-primary">
                  {result.cron}
                </pre>
              </CardContent>
            </Card>

            {/* Explanation */}
            <Card>
              <CardHeader>
                <CardTitle>Explanation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{result.explanation}</p>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel: Next Runs & History */}
          <div className="space-y-6 lg:col-span-1">
            {/* Next 10 Runs */}
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
                <CardHeader>
                  <CardTitle>History</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {history.map((item, i) => (
                      <li
                        key={i}
                        className="cursor-pointer p-2 rounded-md hover:bg-muted/50 transition-colors"
                        onClick={() => handleHistoryClick(item)}
                      >
                        <p className="text-sm font-medium">{item.query}</p>
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
