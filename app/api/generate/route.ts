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
                "You are a helpful assistant that converts plain English schedules into cron expressions and explains them.",
            },
            {
              role: "user",
              content: `Convert this schedule to a cron expression: "${natural}". 
                      Return JSON in this shape:
                      { "cron": "...", "explanation": "...", "runs": ["...", "..."] }`,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    // Extract the model’s reply
    const raw = data.choices?.[0]?.message?.content;

    return NextResponse.json(JSON.parse(raw));
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate cron" },
      { status: 500 }
    );
  }
}
