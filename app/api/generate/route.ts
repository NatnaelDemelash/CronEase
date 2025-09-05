import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { natural } = await req.json();

  if (!natural) {
    return NextResponse.json(
      { error: "Natural text is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1", // ✅ free model
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that converts plain English schedules into cron expressions and explains them. Always respond with valid JSON only.",
            },
            {
              role: "user",
              content: `Convert this schedule to a cron expression: "${natural}". 
                      Return JSON in this shape exactly:
                      { "cron": "...", "explanation": "...", "runs": ["...", "..."] }`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let raw = data.choices?.[0]?.message?.content || "";
    raw = raw.replace(/```(json)?/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      console.error("Bad JSON from model:", raw);
      return NextResponse.json(
        { error: "AI returned invalid JSON" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate cron" },
      { status: 500 }
    );
  }
}
