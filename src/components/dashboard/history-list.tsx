"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Copy, Trash2 } from "lucide-react";

type Item = {
  id: string;
  generatorId: string;
  generatorName: string;
  color: string;
  prompt: string;
  output: string;
  cost: number;
  demo: boolean;
  createdAt: string;
  isImage: boolean;
};

type Props = {
  items: Item[];
};

export default function HistoryList({ items }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(items[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  async function copy(item: Item) {
    try {
      await navigator.clipboard.writeText(item.output);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      /* clipboard unavailable */
    }
  }

  async function remove(id: string) {
    setRemoving(id);
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="history-list">
      {items.map((item) => {
        const open = expanded === item.id;
        return (
          <article key={item.id} className={`history-item ${open ? "open" : ""}`}>
            <button
              className="history-head"
              onClick={() => setExpanded(open ? null : item.id)}
              aria-expanded={open}
            >
              <span className={`generator-icon ${item.color} small`}>{item.generatorName.slice(0, 1)}</span>
              <div className="history-summary">
                <b>{item.generatorName}</b>
                <p>{item.prompt}</p>
              </div>
              <span className="history-meta">
                <span className={item.demo ? "badge-demo" : "badge-live"}>
                  {item.demo ? "Demo" : "Live"}
                </span>
                <small>{item.cost} cr</small>
                <small>
                  {new Date(item.createdAt).toLocaleString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
                <ChevronDown size={16} className="history-chevron" />
              </span>
            </button>

            {open && (
              <div className="history-body">
                {item.isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.output} alt={item.prompt} className="workspace-image" />
                ) : (
                  <pre className="workspace-text">{item.output}</pre>
                )}
                <div className="history-actions">
                  <button className="view-all" onClick={() => copy(item)}>
                    {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === item.id ? "Copied" : "Copy output"}
                  </button>
                  <button
                    className="view-all danger"
                    onClick={() => remove(item.id)}
                    disabled={removing === item.id}
                  >
                    <Trash2 size={14} /> {removing === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
