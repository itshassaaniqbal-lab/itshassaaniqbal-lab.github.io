"use client";

import { useState } from "react";
import { useSectionReveal } from "@/hooks/useSectionReveal";

interface ReviewCardData {
  id: number;
  code: string;
  discipline: string;
  symbol: string;
  review: string;
  source: string;
  accent: "violet" | "blue" | "magenta" | "cyan" | "indigo";
}

const REVIEW_CARDS: readonly ReviewCardData[] = [
  {
    id: 1,
    code: "WEB",
    discipline: "Digital Experience",
    symbol: "</>",
    review:
      "Clear communication, sharp execution and a final product that feels far beyond the original brief.",
    source: "Luxury Brand Team",
    accent: "violet",
  },
  {
    id: 2,
    code: "AI",
    discipline: "Intelligent Systems",
    symbol: "AI",
    review:
      "They transformed a complex workflow into an experience our team could understand and use immediately.",
    source: "SaaS Product Team",
    accent: "blue",
  },
  {
    id: 3,
    code: "APP",
    discipline: "Product Engineering",
    symbol: "01",
    review:
      "Every interaction feels considered. The product is fast, elegant and genuinely enjoyable to use.",
    source: "Technology Founder",
    accent: "magenta",
  },
  {
    id: 4,
    code: "UX",
    discipline: "Design Direction",
    symbol: "UX",
    review:
      "Code N Site brought strategy, design and engineering together without losing speed or attention to detail.",
    source: "Venture Studio",
    accent: "cyan",
  },
  {
    id: 5,
    code: "SYS",
    discipline: "Automation Platform",
    symbol: "∞",
    review:
      "A dependable creative partner with the rare ability to make ambitious ideas feel simple and achievable.",
    source: "Operations Director",
    accent: "indigo",
  },
] as const;

export function ReviewsSection() {
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  const sectionRef = useSectionReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="reviews-section"
      id="reviews"
      aria-labelledby="reviews-title"
    >
      <div className="reviews-atmosphere" aria-hidden="true" />
      <div className="section-shell reviews-shell">
        <header className="reviews-heading section-reveal-item">
          <div>
            <p className="section-kicker"><span />Selected feedback</p>
            <h2 id="reviews-title">
              Good work speaks.
              <span>Great work stays with you.</span>
            </h2>
          </div>
          <p>
            A deck of client perspectives. Hover, focus or tap a card to reveal
            the story behind the work.
          </p>
        </header>

        <div className="review-deck section-reveal-item" aria-label="Client review cards">
          {REVIEW_CARDS.map((card) => {
            const isFlipped = flippedCardId === card.id;

            return (
              <button
                key={card.id}
                className={`review-card review-card--${card.accent}${isFlipped ? " is-flipped" : ""}`}
                type="button"
                aria-pressed={isFlipped}
                aria-label={`${isFlipped ? "Hide" : "Read"} review from ${card.source}`}
                onClick={() => setFlippedCardId(isFlipped ? null : card.id)}
              >
                <span className="review-card__inner">
                  <span className="review-card__face review-card__front">
                    <span className="review-card__corner">
                      <strong>{card.id.toString().padStart(2, "0")}</strong>
                      <small>{card.code}</small>
                    </span>
                    <span className="review-card__symbol" aria-hidden="true">
                      {card.symbol}
                    </span>
                    <span className="review-card__discipline">{card.discipline}</span>
                    <span className="review-card__brand">Code N Site</span>
                  </span>

                  <span className="review-card__face review-card__back">
                    <span className="review-card__back-label">Client note / 0{card.id}</span>
                    <span className="review-card__quote">“{card.review}”</span>
                    <span className="review-card__source">
                      <span aria-hidden="true" />
                      {card.source}
                    </span>
                    <span className="review-card__back-mark" aria-hidden="true">C/N/S</span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="reviews-instruction section-reveal-item" aria-hidden="true">
          <span>Tap a card</span>
          <span className="reviews-instruction__line" />
          <span>Flip / reveal / return</span>
        </div>
      </div>
    </section>
  );
}
