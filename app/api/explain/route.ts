// /api/explain/route.ts

import { NextResponse } from "next/server";
import cronstrue from "cronstrue";
import { CronExpression } from "cron-parser";
export async function POST(req: Request) {
  try {
    const { cron } = await req.json();

    if (!cron) {
      return NextResponse.json(
        { ok: false, error: "Missing cron expression" },
        { status: 400 }
      );
    }

    let humanExp: string;
    try {
      humanExp = cronstrue.toString(cron);
    } catch (err) {
      return NextResponse.json(
        { ok: false, error: "Invalid cron expression" },
        { status: 400 }
      );
    }

    let nextRuns: string[] = [];
    try {
      // Use the 'new' keyword to create an instance of the class
      const interval = new CronExpression(cron, {
        tz: "Africa/Addis_Ababa",
      });
      for (let i = 0; i < 10; i++) {
        nextRuns.push(interval.next().toString());
      }
    } catch (err) {
      console.error("Cron parse error:", err, "for expression:", cron);
      return NextResponse.json(
        { ok: false, error: "Failed to generate next runs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      cron: cron,
      explanation: humanExp,
      nextRuns: nextRuns,
    });
  } catch (err) {
    console.error("API error:", err);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
