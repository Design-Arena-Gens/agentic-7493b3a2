import { NextResponse } from "next/server";
import OpenAI from "openai";
import type { Property } from "../../data/properties";

function buildPropertyContext(property?: Property) {
  if (!property) return "No property is currently selected.";

  const highlightBlock = property.highlights.map((highlight, index) => `${index + 1}. ${highlight}`).join("\n");

  return [
    `Active focus: ${property.title}`,
    `Address: ${property.address}`,
    `Status: ${property.status}`,
    `List price: ${property.price}`,
    `Configuration: ${property.beds} beds | ${property.baths} baths | ${property.area} sqft`,
    `Key highlights:\n${highlightBlock}`,
    "Provide contextual knowledge about nearby transit, school scores, rental comps, walkscore, permit climate, and negotiation tactics."
  ].join("\n");
}

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { message, history, property } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const conversationHistory: { role: "user" | "assistant"; content: string }[] = Array.isArray(history)
    ? history.filter((entry) => typeof entry?.role === "string" && typeof entry?.content === "string")
    : [];

  const systemPrompt = `You are Atlas Agent, an elite real estate AI strategist helping buyers evaluate San Francisco properties. Blend macro market intelligence with micro-level insights like block-by-block desirability, proptech metrics, nearby development pipelines, and financing angles. Offer candid guidance, actionable steps, and always end with a proactive follow-up suggestion.`;

  const propertyContext = buildPropertyContext(property as Property | undefined);

  const messages = [
    { role: "system" as const, content: systemPrompt },
    {
      role: "system" as const,
      content: `Context for current property focus:\n${propertyContext}`
    },
    ...conversationHistory,
    {
      role: "user" as const,
      content: message
    }
  ];

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      temperature: 0.6,
      top_p: 0.9,
      messages
    });

    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  } catch (error) {
    console.error("chat api failure", error);
    return NextResponse.json({ error: "Unable to generate response" }, { status: 500 });
  }
}
