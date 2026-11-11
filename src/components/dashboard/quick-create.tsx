"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Sparkles, Zap } from "lucide-react";
import { generators } from "@/config/generators";

type Props = {
  credits: number;
};

export default function QuickCreate({ credits }: Props) {
  const router = useRouter();
  const [generatorId, setGeneratorId] = useState(generators[0]?.id ?? "writer");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selected = generators.find((g) => g.id === generatorId) ?? generators[0];

  async function generate() {
    setError("");
    if (!selected) return;
    if (prompt.trim().length < 3) {
      setError("Add a prompt to preview the generation flow.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ generatorId: selected.id, prompt }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Generation failed.");
        return;
      }
      setPrompt("");
      router.push("/dashboard/history");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="prompt-wrap">
      <div className="quick-tools">
        {generators.map((g) => {
          const Icon = g.icon;
          return (
            <button
              key={g.id}
              type="button"
              className={g.id === generatorId ? "quick-tool active" : "quick-tool"}
              onClick={() => setGeneratorId(g.id)}
            >
              <Icon size={14} />
              {g.name}
            </button>
          );
        })}
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={selected?.placeholder ?? "Describe what you want to create..."}
        rows={4}
        disabled={loading}
      />

      {error && <div className="workspace-error">{error}</div>}

      <div className="prompt-bottom">
        <span>
          <Sparkles size={13} /> Costs {selected?.cost ?? 1} credit
          {(selected?.cost ?? 1) > 1 ? "s" : ""} · {credits} available
        </span>
        <button className="button" type="button" onClick={generate} disabled={loading}>
          {loading ? <Loader2 size={15} className="spin" /> : <Zap size={15} />}
          {loading ? "Generating…" : "Generate"}
          {!loading && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );
}
