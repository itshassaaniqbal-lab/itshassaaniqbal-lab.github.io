"use client";

import { useState } from "react";
import Image from "next/image";
import { useSectionReveal } from "@/hooks/useSectionReveal";

interface ReviewCardData {
  readonly id: number;
  readonly image: string;
  readonly imageAlt: string;
  readonly review: string;
  readonly source: string;
  readonly accent: "violet" | "blue" | "magenta" | "cyan" | "indigo";
}

const REVIEW_CARDS: readonly ReviewCardData[] = [
  {
    id: 1,
    image: "/review-cards/queen-clubs.webp",
    imageAlt: "Luxury black and gold Queen of Clubs playing card",
    review:
      "Clear communication, sharp execution and a final product that feels far beyond the original brief.",
    source: "Luxury Brand Team",
    accent: "violet",
  },
  {
    id: 2,
    image: "/review-cards/jack-clubs.webp",
    imageAlt: "Luxury black, red and gold Jack of Clubs playing card",
    review:
      "They transformed a complex workflow into an experience our team could understand and use immediately.",
    source: "SaaS Product Team",
    accent: "blue",
  },
  {
    id: 3,
    image: "/review-cards/king-diamonds.webp",
    imageAlt: "Luxury black, red and gold King of Diamonds playing card",
    review:
      "Every interaction feels considered. The product is fast, elegant and genuinely enjoyable to use.",
    source: "Technology Founder",
    accent: "magenta",
  },
  {
    id: 4,
    image: "/review-cards/king-hearts.webp",
    imageAlt: "Luxury black, red and gold King of Hearts playing card",
    review:
      "Code N Site brought strategy, design and engineering together without losing speed or attention to detail.",
    source: "Venture Studio",
    accent: "cyan",
  },
  {
    id: 5,
    image: "/review-cards/joker.webp",
    imageAlt: "Luxury black, red and gold Joker playing card",
    review:
      "A dependable creative partner with the rare ability to make ambitious ideas feel simple and achievable.",
    source: "Operations Director",
    accent: "indigo",
  },
];

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
                    <Image
                      className="review-card__image"
                      src={card.image}
                      alt={card.imageAlt}
                      width={720}
                      height={1047}
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="review-card__image-shade" aria-hidden="true" />
                    <span className="review-card__front-hint">
                      <small>Client story / 0{card.id}</small>
                      <strong>Tap to reveal</strong>
                    </span>
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
