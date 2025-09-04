import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { cron } = await req.json();

  if (!cron) {
    return NextResponse.json({ error: "Cron is required" }, { status: 400 });
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
          model: "deepseek/deepseek-r1",
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that explains cron expressions and lists next run times.",
            },
            {
              role: "user",
              content: `Explain this cron expression: "${cron}". 
                      Return JSON in this shape:
                      { "cron": "...", "explanation": "...", "runs": ["...", "..."] }`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content;

    return NextResponse.json(JSON.parse(raw));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to explain cron" },
      { status: 500 }
    );
  }
}
