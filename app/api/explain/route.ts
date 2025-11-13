import { NextResponse } from "next/server";
import cronstrue from "cronstrue";
import { CronExpressionParser } from "cron-parser";

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
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid cron expression" },
        { status: 400 }
      );
    }

    const nextRuns: string[] = [];
    try {
      const interval = CronExpressionParser.parse(cron, {
        tz: "Africa/Addis_Ababa",
      });

      for (let i = 0; i < 10; i++) {
        nextRuns.push(interval.next().toString());
      }
    } catch (error) {
      console.error("Cron parse error:", error, "for expression:", cron);
      return NextResponse.json(
        { ok: false, error: "Failed to generate next runs" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      cron,
      explanation: humanExp,
      nextRuns,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
