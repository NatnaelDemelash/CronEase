// app/api/generate/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { format } from "date-fns";
import { Cron } from "croner";

type AiShape = { cron?: string; explanation?: string };

function json(status: number, body: unknown) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  const { natural } = (await req.json().catch(() => ({}))) as {
    natural?: string;
  };

  if (!natural) {
    return json(400, { ok: false, error: "Natural text is required." });
  }

  try {
    // 1) Ask your model for cron + explanation
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: [
            {
              role: "system",
              content:
                "You convert plain English schedules into cron expressions and explain them. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: `Convert this schedule to a cron expression: "${natural}". 
Return JSON in this shape exactly:
{ "cron": "...", "explanation": "..." }`,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errTxt = await response.text().catch(() => "");
      return json(response.status, {
        ok: false,
        error: `OpenRouter ${response.status}`,
        details: errTxt?.slice(0, 500),
      });
    }

    const data = await response.json();
    let raw = String(data?.choices?.[0]?.message?.content ?? "")
      .replace(/```(?:json)?/g, "")
      .trim();

    let ai: AiShape;
    try {
      ai = JSON.parse(raw);
    } catch {
      return json(502, {
        ok: false,
        error: "AI returned invalid JSON.",
        details: raw.slice(0, 500),
      });
    }

    const cron = ai.cron?.trim();
    if (!cron) {
      return json(502, {
        ok: false,
        error: "AI did not return a cron expression.",
      });
    }

    // 2) Generate next 10 runs with Croner (timezone optional)
    const tz = "Africa/Addis_Ababa"; // change/remove to taste
    let runs: string[] = [];

    try {
      const job = new Cron(cron, { timezone: tz }); // throws if invalid
      let next = job.nextRun();
      for (let i = 0; i < 10 && next; i++) {
        runs.push(format(next, "MMM d, yyyy – h:mm a"));
        next = job.nextRun(next);
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to parse cron expression.";
      return json(422, { ok: false, error: msg, cron });
    }

    return json(200, {
      ok: true,
      cron,
      explanation: ai.explanation ?? "Cron schedule parsed successfully.",
      runs,
      timezone: tz,
    });
  } catch (err) {
    console.error("Generate API error:", err);
    return json(500, { ok: false, error: "Failed to generate cron." });
  }
}
