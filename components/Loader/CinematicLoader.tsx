"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const LOADER_SESSION_KEY = "code-n-site:cinematic-loader-v2";
const PROGRESS_DURATION_MS = 1_850;
const REVEAL_DELAY_MS = 160;
const FALLBACK_DURATION_MS = 4_000;

export function CinematicLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const purpleGlowRef = useRef<HTMLDivElement>(null);
  const blueGlowRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLOutputElement>(null);
  const isFinishingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const revealWebsite = useCallback(async () => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;

    try {
      sessionStorage.setItem(LOADER_SESSION_KEY, "true");
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }

    document.documentElement.style.overflow = "";
    const overlay = overlayRef.current;
    const header = document.querySelector<HTMLElement>(".site-header");
    const websiteElements = document.querySelectorAll<HTMLElement>(
      ".hero, .expertise-section",
    );

    if (!overlay) {
      setIsVisible(false);
      return;
    }

    const overlayAnimation = overlay.animate(
      [
        {
          clipPath: "inset(0 0 0 0)",
          filter: "blur(0px)",
          opacity: 1,
          transform: "scale(1)",
        },
        {
          clipPath: "inset(0 0 100% 0)",
          filter: "blur(10px)",
          opacity: 0.92,
          transform: "scale(1.025)",
        },
      ],
      {
        duration: 1_050,
        easing: "cubic-bezier(0.76, 0, 0.24, 1)",
        fill: "forwards",
      },
    );

    const websiteAnimations = Array.from(websiteElements, (element) =>
      element.animate(
        [
          { filter: "blur(14px)", opacity: 0.45, transform: "scale(1.018)" },
          { filter: "blur(0px)", opacity: 1, transform: "scale(1)" },
        ],
        {
          duration: 1_200,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "both",
        },
      ),
    );

    // The fixed header relies on translateX(-50%) for centering. Animating it
    // with the generic scale transform used to overwrite that positioning on
    // the first visit, leaving the header shifted until a refresh.
    const headerAnimation = header?.animate(
      [
        {
          filter: "blur(14px)",
          opacity: 0.45,
          transform: "translateX(-50%) translateY(-18px)",
        },
        {
          filter: "blur(0px)",
          opacity: 1,
          transform: "translateX(-50%) translateY(0px)",
        },
      ],
      {
        duration: 1_200,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "both",
      },
    );

    await Promise.allSettled([
      overlayAnimation.finished,
      ...websiteAnimations.map((animation) => animation.finished),
      ...(headerAnimation ? [headerAnimation.finished] : []),
    ]);

    // Release fill-mode styles so responsive and future scroll transforms are
    // always controlled by the stylesheet after the reveal completes.
    websiteAnimations.forEach((animation) => animation.cancel());
    headerAnimation?.cancel();
    setIsVisible(false);
  }, []);

  useEffect(() => {
    let hasPlayed = false;
    try {
      hasPlayed = sessionStorage.getItem(LOADER_SESSION_KEY) === "true";
    } catch {
      hasPlayed = false;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (hasPlayed || prefersReducedMotion) {
      const skipFrame = window.requestAnimationFrame(() => setIsVisible(false));
      return () => window.cancelAnimationFrame(skipFrame);
    }

    document.documentElement.style.overflow = "hidden";

    const entranceAnimations = [
      markRef.current?.animate(
        [
          { filter: "blur(16px)", opacity: 0, transform: "scale(0.82) rotate(-5deg)" },
          { filter: "blur(0px)", opacity: 1, transform: "scale(1) rotate(0deg)" },
        ],
        {
          duration: 900,
          delay: 120,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        },
      ),
      titleRef.current?.animate(
        [
          { filter: "blur(12px)", letterSpacing: "0.12em", opacity: 0, transform: "translateY(18px)" },
          { filter: "blur(0px)", letterSpacing: "-0.055em", opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 1_000,
          delay: 260,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        },
      ),
      detailRef.current?.animate(
        [
          { filter: "blur(7px)", opacity: 0, transform: "translateY(8px)" },
          { filter: "blur(0px)", opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 700,
          delay: 600,
          easing: "ease-out",
          fill: "both",
        },
      ),
    ];

    const ambientAnimations = [
      purpleGlowRef.current?.animate(
        [
          { opacity: 0.22, transform: "translate3d(-4%, 3%, 0) scale(0.94)" },
          { opacity: 0.42, transform: "translate3d(5%, -4%, 0) scale(1.08)" },
        ],
        { duration: 2_600, direction: "alternate", iterations: Infinity },
      ),
      blueGlowRef.current?.animate(
        [
          { opacity: 0.12, transform: "translate3d(4%, -2%, 0) scale(1.06)" },
          { opacity: 0.3, transform: "translate3d(-5%, 5%, 0) scale(0.94)" },
        ],
        { duration: 3_100, direction: "alternate", iterations: Infinity },
      ),
    ];

    const startTime = performance.now();
    const updateProgress = (timestamp: number) => {
      const rawProgress = Math.min((timestamp - startTime) / PROGRESS_DURATION_MS, 1);
      const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
      const percentage = Math.round(easedProgress * 100);

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${easedProgress})`;
      }
      if (counterRef.current) {
        counterRef.current.value = percentage.toString().padStart(2, "0");
      }

      if (rawProgress < 1) {
        animationFrameRef.current = window.requestAnimationFrame(updateProgress);
      } else {
        window.setTimeout(() => void revealWebsite(), REVEAL_DELAY_MS);
      }
    };

    animationFrameRef.current = window.requestAnimationFrame(updateProgress);
    const fallbackTimer = window.setTimeout(
      () => void revealWebsite(),
      FALLBACK_DURATION_MS,
    );

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
      window.clearTimeout(fallbackTimer);
      entranceAnimations.forEach((animation) => animation?.cancel());
      ambientAnimations.forEach((animation) => animation?.cancel());
      document.documentElement.style.overflow = "";
    };
  }, [revealWebsite]);

  if (!isVisible) return null;

  return (
    <div
      ref={overlayRef}
      className="cinematic-loader"
      role="dialog"
      aria-label="Code N Site is loading"
      aria-modal="true"
    >
      <div
        ref={purpleGlowRef}
        className="cinematic-loader__glow cinematic-loader__glow--purple"
        aria-hidden="true"
      />
      <div
        ref={blueGlowRef}
        className="cinematic-loader__glow cinematic-loader__glow--blue"
        aria-hidden="true"
      />
      <div className="cinematic-loader__grid" aria-hidden="true" />
      <div className="cinematic-loader__noise" aria-hidden="true" />

      <div className="cinematic-loader__content">
        <div ref={markRef} className="cinematic-loader__mark" aria-hidden="true">
          C<span>/</span>N<span>/</span>S
        </div>
        <h2 ref={titleRef} className="cinematic-loader__title">
          Code N Site
        </h2>
        <div ref={detailRef} className="cinematic-loader__detail">
          <span>Crafting digital experiences</span>
          <span className="cinematic-loader__pulse" aria-hidden="true" />
        </div>
      </div>

      <div className="cinematic-loader__progress" aria-label="Loading progress">
        <div className="cinematic-loader__progress-track" aria-hidden="true">
          <span ref={progressRef} className="cinematic-loader__progress-fill" />
        </div>
        <div className="cinematic-loader__progress-meta">
          <span>Loading experience</span>
          <span>
            <output ref={counterRef}>00</output>%
          </span>
        </div>
      </div>

      <button
        className="cinematic-loader__skip"
        type="button"
        onClick={() => void revealWebsite()}
      >
        Skip
      </button>
    </div>
  );
}
