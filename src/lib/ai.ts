import type { GenerateResult } from "./types";
import { getGenerator } from "@/config/generators";

const TEXT_MODELS = new Set(["writer", "code", "seo", "social", "product-copy", "chat"]);

function isOpenAiConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

function textModel(): string {
  return process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
}

function imageModel(): string {
  return process.env.OPENAI_IMAGE_MODEL?.trim() || "dall-e-3";
}

async function callChat(system: string, prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: textModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`AI provider error (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) throw new Error("AI provider returned an empty response.");
  return content;
}

async function callImage(prompt: string): Promise<string> {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: imageModel(),
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Image provider error (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = data.data?.[0]?.b64_json;
  if (!b64) throw new Error("Image provider returned an empty response.");
  return `data:image/png;base64,${b64}`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function wrapText(text: string, max: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    if ((line + " " + word).trim().length > max) {
      if (line) lines.push(line.trim());
      line = word;
    } else {
      line = `${line} ${word}`.trim();
    }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 4);
}

function demoImage(prompt: string): string {
  const short = prompt.length > 90 ? `${prompt.slice(0, 87)}...` : prompt;
  const lines = wrapText(short, 36);
  const textNodes = lines
    .map(
      (line, i) =>
        `<text x="512" y="${470 + i * 44}" text-anchor="middle" fill="white" font-size="30" font-family="Segoe UI, sans-serif" opacity="0.92">${escapeXml(line)}</text>`,
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4c1d95"/>
      <stop offset="45%" stop-color="#6d28d9"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>
    <radialGradient id="glow" cx="70%" cy="25%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#g)"/>
  <rect width="1024" height="1024" fill="url(#glow)"/>
  <circle cx="820" cy="180" r="120" fill="#a78bfa" opacity="0.35"/>
  <circle cx="180" cy="840" r="160" fill="#60a5fa" opacity="0.25"/>
  <rect x="64" y="64" width="896" height="896" rx="36" fill="none" stroke="white" stroke-opacity="0.22" stroke-width="3"/>
  <text x="512" y="390" text-anchor="middle" fill="#e9d5ff" font-size="22" font-family="Segoe UI, sans-serif" letter-spacing="6">AIFORGE DEMO PREVIEW</text>
  ${textNodes}
  <text x="512" y="880" text-anchor="middle" fill="white" fill-opacity="0.65" font-size="20" font-family="Segoe UI, sans-serif">Connect OPENAI_API_KEY for live images</text>
</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

function extractTopic(prompt: string): string {
  const cleaned = prompt
    .replace(/^(please\s+)?(write|create|generate|make|draft|explain|help me)\s+/i, "")
    .replace(/\s+(for|about|on|in|with|using)\s+$/i, "")
    .trim();
  if (cleaned.length >= 3) return cleaned.slice(0, 120);
  return "your idea";
}

function demoOutput(generatorId: string, prompt: string): string {
  const topic = extractTopic(prompt);

  switch (generatorId) {
    case "writer": {
      return `# ${topic.charAt(0).toUpperCase() + topic.slice(1)}

## Introduction
In today's fast-moving landscape, ${topic} deserves more than a surface-level take. This draft gives you a structured starting point you can expand, refine, and publish.

## Why it matters
- Readers look for clarity before complexity
- Strong examples beat abstract claims
- A clear structure keeps people reading to the end

## Key points to cover
1. **Context** — set the scene and define the problem
2. **Insight** — share the angle that makes this piece worth reading
3. **Evidence** — support claims with concrete examples
4. **Action** — end with steps the reader can apply immediately

## Draft body
${topic.charAt(0).toUpperCase() + topic.slice(1)} works best when you start from a real user need, remove friction, and show progress early. Instead of listing features, walk through a short story: the before state, the turning point, and the measurable after state.

> Demo output — configure OPENAI_API_KEY for live AI generation.`;
    }

    case "code": {
      return `// ${topic}
// Demo output — connect OPENAI_API_KEY for live code generation.

type Result<T> = { ok: true; data: T } | { ok: false; error: string };

async function run(input: string): Promise<Result<string>> {
  if (!input.trim()) {
    return { ok: false, error: "Input must not be empty" };
  }

  try {
    const normalized = input.trim().toLowerCase();
    const data = \`\${normalized}::\${Date.now()}\`;
    return { ok: true, data };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export { run };

/**
 * Suggested next steps
 * 1. Add unit tests for empty and valid inputs
 * 2. Replace the mock transform with your real business logic
 * 3. Log failures with structured context for observability
 */`;
    }

    case "seo": {
      const title = `SEO plan: ${topic}`.slice(0, 60);
      return `# SEO blueprint — ${topic}

## Metadata
- **Title tag:** ${title}
- **Meta description:** Discover everything you need about ${topic}. Practical tips, clear examples and a step-by-step checklist you can use today. (152 chars)
- **Primary keyword:** ${topic.split(/\s+/).slice(0, 3).join(" ").toLowerCase()}
- **Secondary keywords:** guide, examples, checklist, best practices

## Content outline
1. H1 — Complete guide to ${topic}
2. H2 — What is ${topic} and who is it for
3. H2 — Step-by-step process
4. H2 — Common mistakes to avoid
5. H2 — FAQ

## On-page checklist
- [ ] Primary keyword in H1, first 100 words and URL slug
- [ ] Related terms in H2 headings
- [ ] Internal links to 2–3 supporting pages
- [ ] Image alt text that describes the visual, not keywords
- [ ] Page loads under 2.5s on mobile

## Content recommendations
Write for search intent first: if the query is informational, lead with definition and steps; if commercial, lead with comparison and criteria. Aim for 1,200–1,800 words with original examples.

> Demo output — configure OPENAI_API_KEY for live SEO analysis.`;
    }

    case "social": {
      return `# Social pack — ${topic}

## Post 1 (LinkedIn / X)
Most teams underestimate ${topic}. Here's the shift that changes results:
→ Start from the user outcome, not the feature list
→ Show one concrete before/after
→ End with a single clear CTA

Save this for your next launch checklist.

#${topic.split(/\s+/)[0]?.replace(/[^a-zA-Z0-9]/g, "") || "build"} #ai #growth

## Post 2 (short-form)
${topic} in 3 steps:
1. Define the one metric that matters
2. Ship the smallest useful version
3. Measure, cut friction, repeat

What's blocking you from starting this week?

## Post 3 (thread opener)
I spent weeks on ${topic}. The biggest mistake? Optimizing the wrong step first.
A quick thread on what actually moved the needle 🧵

## Hashtag set
#${topic.split(/\s+/)[0]?.replace(/[^a-zA-Z0-9]/g, "") || "tips"} #productivity #creators #saas #marketing

> Demo output — configure OPENAI_API_KEY for live post generation.`;
    }

    case "product-copy": {
      return `# Product copy — ${topic}

## Short description
A thoughtfully designed ${topic} built for people who value clarity, speed and reliable results every day.

## Full description
Meet ${topic} — crafted to remove friction from your routine. Every detail is intentional: durable materials, a clean interface, and a setup that takes minutes, not hours. Whether you are getting started or leveling up, it adapts to how you actually work.

## Feature bullets
- **Effortless setup** — go from unboxing to first result in under 10 minutes
- **Built to last** — premium construction with a finish that stays sharp
- **Flexible by design** — works solo or as part of your existing workflow
- **Support you can trust** — clear docs and responsive help when you need it

## SEO bullet points
- Ideal for beginners and experienced users
- Compact footprint, full performance
- Backed by a straightforward warranty

## Suggested CTA
Upgrade your everyday — order ${topic} today.

> Demo output — configure OPENAI_API_KEY for live product copy.`;
    }

    case "chat": {
      return `Great question about **${topic}**.

Here's a structured way to think about it:

1. **Clarify the goal** — what does a good outcome look like in one sentence?
2. **List constraints** — time, budget, tools, people involved
3. **Compare options** — sketch 2–3 paths and the trade-offs of each
4. **Pick the smallest test** — run the cheapest experiment that could change your mind

### Practical next step
Write down the single biggest unknown, then define what evidence would confirm or reject it this week.

### Follow-ups you might consider
- What would make this 10× easier?
- Who has already solved a similar problem?
- What can you automate first?

> Demo output — configure OPENAI_API_KEY for live AI chat.`;
    }

    default: {
      return `# Result for: ${topic}

## Summary
This is a structured demo response for **${topic}**. It shows the full generation flow end-to-end: prompt in, formatted result out, credits deducted, history saved.

## Details
- **Prompt received:** ${prompt.slice(0, 200)}${prompt.length > 200 ? "..." : ""}
- **Generator:** ${getGenerator(generatorId)?.name ?? generatorId}
- **Mode:** Demo (no OPENAI_API_KEY configured)

## Next steps
1. Add OPENAI_API_KEY to .env.local
2. Restart the dev server
3. Generate again — output will come from the live provider

> Demo output — configure OPENAI_API_KEY for live generation.`;
    }
  }
}

export async function generateContent(
  generatorId: string,
  prompt: string,
): Promise<GenerateResult> {
  const generator = getGenerator(generatorId);
  if (!generator) throw new Error("Unknown generator.");

  const cleanPrompt = prompt.trim();
  if (!cleanPrompt) throw new Error("Prompt is required.");

  if (isOpenAiConfigured()) {
    if (generatorId === "image") {
      const output = await callImage(cleanPrompt);
      return { output, demo: false };
    }
    if (TEXT_MODELS.has(generatorId)) {
      const output = await callChat(generator.systemPrompt, cleanPrompt);
      return { output, demo: false };
    }
  }

  if (generatorId === "image") {
    return { output: demoImage(cleanPrompt), demo: true };
  }

  return { output: demoOutput(generatorId, cleanPrompt), demo: true };
}

export function isLiveAiEnabled(): boolean {
  return isOpenAiConfigured();
}
