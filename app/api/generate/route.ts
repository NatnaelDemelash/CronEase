import { NextResponse } from "next/server";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";

// --- Human → Cron conversion ---
function humanToCron(input: string): string | null {
  const text = input.toLowerCase().trim();

  type DayName =
    | "sunday"
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday";

  const days: Record<DayName, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  // Handle "at 0 0 on 1st of month"
  const monthlySpecific = text.match(
    /at (\d{1,2}) (\d{1,2}) on (\d{1,2})(?:st|nd|rd|th) of month/
  );
  if (monthlySpecific) {
    const minute = parseInt(monthlySpecific[1], 10);
    const hour = parseInt(monthlySpecific[2], 10);
    const day = parseInt(monthlySpecific[3], 10);
    return `${minute} ${hour} ${day} * *`;
  }

  // Handle multiple days: "every Monday and Friday at 9am"
  const multiWeekly = text.match(
    /every (sunday|monday|tuesday|wednesday|thursday|friday|saturday) and (sunday|monday|tuesday|wednesday|thursday|friday|saturday) at (\d{1,2})(?::(\d{2}))?(am|pm)?/
  );
  if (multiWeekly) {
    const day1 = days[multiWeekly[1] as DayName];
    const day2 = days[multiWeekly[2] as DayName];
    let hour = parseInt(multiWeekly[3], 10);
    const minute = multiWeekly[4] ? parseInt(multiWeekly[4], 10) : 0;
    const ampm = multiWeekly[5];

    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;

    return `${minute} ${hour} * * ${day1},${day2}`;
  }

  // Interval: "every 5 minutes" or "every 2 hours"
  const intervalMatch = text.match(/every (\d+) (minutes?|hours?)/);
  if (intervalMatch) {
    const value = intervalMatch[1];
    const unit = intervalMatch[2];
    if (unit.startsWith("minute")) return `*/${value} * * * *`;
    if (unit.startsWith("hour")) return `0 */${value} * * *`;
  }

  // Daily: "every day at 2pm"
  const daily = text.match(/every day at (\d{1,2})(?::(\d{2}))?(am|pm)?/);
  if (daily) {
    let hour = parseInt(daily[1], 10);
    const minute = daily[2] ? parseInt(daily[2], 10) : 0;
    const ampm = daily[3];
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    return `${minute} ${hour} * * *`;
  }

  // Weekly: "every Monday at 9am"
  const weekly = text.match(
    /every (sunday|monday|tuesday|wednesday|thursday|friday|saturday) at (\d{1,2})(?::(\d{2}))?(am|pm)?/
  );
  if (weekly) {
    const dayName = weekly[1] as DayName;
    const day = days[dayName];
    let hour = parseInt(weekly[2], 10);
    const minute = weekly[3] ? parseInt(weekly[3], 10) : 0;
    const ampm = weekly[4];
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    return `${minute} ${hour} * * ${day}`;
  }

  // Monthly: "on 1st of month at 3pm"
  const monthly = text.match(
    /on (\d{1,2})(?:st|nd|rd|th) of month at (\d{1,2})(?::(\d{2}))?(am|pm)?/
  );
  if (monthly) {
    const day = parseInt(monthly[1], 10);
    let hour = parseInt(monthly[2], 10);
    const minute = monthly[3] ? parseInt(monthly[3], 10) : 0;
    const ampm = monthly[4];
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    return `${minute} ${hour} ${day} * *`;
  }

  return null;
}

// --- API Route ---
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, mode } = body;

    if (!query || !mode) {
      return NextResponse.json(
        { ok: false, error: "Missing query or mode" },
        { status: 400 }
      );
    }

    let cronExp: string | null = null;
    let humanExp: string | null = null;

    if (mode === "generate") {
      cronExp = humanToCron(query);
      if (!cronExp) {
        return NextResponse.json(
          { ok: false, error: "Could not parse input" },
          { status: 400 }
        );
      }
      humanExp = cronstrue.toString(cronExp);
    } else if (mode === "explain") {
      cronExp = query;
      try {
        if (cronExp) humanExp = cronstrue.toString(cronExp);
      } catch {
        return NextResponse.json(
          { ok: false, error: "Invalid cron expression" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { ok: false, error: "Invalid mode" },
        { status: 400 }
      );
    }

    // Generate next 10 runs safely
    const nextRuns: string[] = [];
    try {
      if (!cronExp) throw new Error("Cron expression is null");

      const interval = CronExpressionParser.parse(cronExp, {
        tz: "Africa/Addis_Ababa",
      });

      for (let i = 0; i < 10; i++) {
        nextRuns.push(interval.next().toString());
      }
    } catch (_err) {
      console.error("Cron parse error for expression:", cronExp);
      return NextResponse.json(
        { ok: false, error: "Failed to generate next runs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      cron: cronExp,
      explanation: humanExp,
      nextRuns,
    });
  } catch (_err) {
    console.error("API error:", _err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
