"use client";

import { useState } from "react";

type Props = {
  categories: string[];
};

export default function CategoryFilter({ categories }: Props) {
  const [active, setActive] = useState(categories[0] ?? "All tools");

  function apply(category: string) {
    setActive(category);
    const cards = document.querySelectorAll<HTMLElement>(".generators-full .generator-card");
    cards.forEach((card) => {
      const cat = card.dataset.category;
      const show = category === "All tools" || cat === category;
      card.style.display = show ? "" : "none";
    });
  }

  return (
    <div className="filter-row">
      {categories.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => apply(f)}
          className={active === f ? "filter-active" : ""}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
