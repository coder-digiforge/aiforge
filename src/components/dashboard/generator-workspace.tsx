"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Copy, Loader2, Sparkles, Zap } from "lucide-react";
import type { Generator } from "@/config/generators";

type Props = {
  generator: Generator;
  initialCredits: number;
};

export default function GeneratorWorkspace({ generator, initialCredits }: Props) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [credits, setCredits] = useState(initialCredits);
  const [demo, setDemo] = useState(true);
  const isImage = generator.id === "image";

  async function generate() {
    setError("");
    if (prompt.trim().length < 3) {
      setError("Prompt must be at least 3 characters.");
      return;
    }
    setLoading(true);
    setOutput("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatorId: generator.id, prompt }),
      });
      const data = (await res.json()) as {
        output?: string;
        error?: string;
        credits?: number;
        demo?: boolean;
      };
      if (!res.ok || !data.output) {
        setError(data.error ?? "Generation failed.");
        return;
      }
      setOutput(data.output);
      setDemo(Boolean(data.demo));
      if (typeof data.credits === "number") setCredits(data.credits);
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setError("Could not copy to clipboard.");
    }
  }

  return (
    <div className="workspace">
      <div className="workspace-meta">
        <div className={`generator-icon ${generator.color}`}>
          <generator.icon size={20} />
        </div>
        <div>
          <span className="section-kicker">{generator.category.toUpperCase()}</span>
          <h1>{generator.name}</h1>
          <p>{generator.description}</p>
        </div>
        <div className="workspace-cost">
          <Zap size={14} /> {generator.cost} credit{generator.cost > 1 ? "s" : ""} · {credits} left
        </div>
      </div>

      <div className="workspace-grid">
        <section className="workspace-input">
          <div className="section-title-row">
            <h2>Your prompt</h2>
            <span className="ai-chip">
              <Sparkles size={13} /> {demo && output ? "Demo output" : "AI powered"}
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={generator.placeholder}
            rows={8}
            disabled={loading}
          />

          {error && <div className="workspace-error">{error}</div>}

          <div className="prompt-bottom">
            <span>
              <Sparkles size={13} /> Be specific for better results
            </span>
            <button onClick={generate} disabled={loading}>
              {loading ? <Loader2 size={15} className="spin" /> : <ArrowRight size={15} />}
              {loading ? "Generating..." : `Generate · ${generator.cost} cr`}
            </button>
          </div>
        </section>

        <section className="workspace-output">
          <div className="section-title-row">
            <h2>Result</h2>
            {output && (
              <button className="view-all" onClick={copyOutput}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          {!output && !loading && (
            <div className="empty-state workspace-empty">
              <div>
                <Sparkles size={20} />
              </div>
              <b>Output will appear here</b>
              <p>Describe what you need and hit generate.</p>
            </div>
          )}

          {loading && (
            <div className="workspace-loading">
              <Loader2 size={22} className="spin" />
              <b>Working on it...</b>
              <p>This usually takes a few seconds.</p>
            </div>
          )}

          {output && !loading && (
            <>
              {isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={output} alt={prompt} className="workspace-image" />
              ) : (
                <pre className="workspace-text">{output}</pre>
              )}
              {demo && (
                <p className="workspace-demo-note">
                  Demo mode — add OPENAI_API_KEY in .env.local for live provider output.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
