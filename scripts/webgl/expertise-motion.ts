// Isolated browser animation entry, bundled before the app starts.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const section = document.querySelector<HTMLElement>(".expertise-section");

if (section) {
  gsap.registerPlugin(ScrollTrigger);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cleanups: Array<() => void> = [];

  const context = gsap.context(() => {
    const heading = section.querySelector<HTMLElement>("[data-expertise-heading]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-expertise-card]");
    const stats = gsap.utils.toArray<HTMLElement>("[data-expertise-stat]");
    const counters = gsap.utils.toArray<HTMLElement>("[data-stat-value]");
    const buttons = section.querySelector<HTMLElement>("[data-expertise-buttons]");
    const model = section.querySelector<HTMLElement>("[data-expertise-model]");
    const dust = gsap.utils.toArray<HTMLElement>("[data-expertise-dust]");

    if (reducedMotion) {
      gsap.set([heading, cards, stats, buttons, model], { clearProps: "all" });
      counters.forEach((counter) => {
        const target = counter.dataset.count;
        const suffix = counter.dataset.suffix ?? "";
        if (target) counter.textContent = `${target}${suffix}`;
      });
      return;
    }

    gsap.to("[data-expertise-glow='purple']", {
      xPercent: 14,
      yPercent: -10,
      scale: 1.12,
      duration: 9,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    gsap.to("[data-expertise-glow='blue']", {
      xPercent: -12,
      yPercent: 12,
      scale: 1.16,
      duration: 11,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    gsap.to("[data-expertise-fog]", {
      xPercent: 8,
      opacity: 0.55,
      duration: 12,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    dust.forEach((particle, index) => {
      gsap.to(particle, {
        x: ((index * 19) % 34) - 17,
        y: -22 - ((index * 11) % 34),
        opacity: 0.12 + ((index * 7) % 20) / 100,
        duration: 4.5 + (index % 6),
        delay: (index % 8) * 0.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    });

    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: section, start: "top 72%", once: true },
    });

    if (model) {
      timeline.fromTo(
        model,
        { autoAlpha: 0, rotateY: -5, scale: 0.94 },
        { autoAlpha: 1, rotateY: 0, scale: 1, duration: 1.15 },
        0,
      );
    }
    if (heading) {
      timeline.fromTo(
        heading,
        { autoAlpha: 0, filter: "blur(14px)", y: 46 },
        { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1 },
        0.12,
      );
    }
    timeline.fromTo(
      cards,
      { autoAlpha: 0, scale: 0.94, y: 28 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.72, stagger: 0.055 },
      0.35,
    );
    timeline.fromTo(
      stats,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.08 },
      0.7,
    );
    if (buttons) {
      timeline.fromTo(buttons, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.88);
    }

    counters.forEach((counter) => {
      const count = Number(counter.dataset.count);
      if (!Number.isFinite(count)) return;
      const suffix = counter.dataset.suffix ?? "";
      const value = { current: 0 };
      gsap.to(value, {
        current: count,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: { trigger: counter, start: "top 88%", once: true },
        onUpdate: () => {
          counter.textContent = `${Math.round(value.current)}${suffix}`;
        },
      });
    });
  }, section);

  if (!reducedMotion) {
    section.querySelectorAll<HTMLElement>("[data-expertise-card]").forEach((card) => {
      const rotateX = gsap.quickTo(card, "rotationX", { duration: 0.42, ease: "power3.out" });
      const rotateY = gsap.quickTo(card, "rotationY", { duration: 0.42, ease: "power3.out" });
      const lift = gsap.quickTo(card, "y", { duration: 0.3, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        rotateX(y * -8);
        rotateY(x * 9);
        lift(-5);
        card.style.setProperty("--reflection-x", `${(x + 0.5) * 100}%`);
        card.style.setProperty("--reflection-y", `${(y + 0.5) * 100}%`);
      };
      const leave = () => {
        rotateX(0);
        rotateY(0);
        lift(0);
        card.style.setProperty("--reflection-x", "50%");
        card.style.setProperty("--reflection-y", "50%");
      };
      card.addEventListener("pointermove", move);
      card.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        card.removeEventListener("pointermove", move);
        card.removeEventListener("pointerleave", leave);
      });
    });

    section.querySelectorAll<HTMLElement>("[data-magnetic-button]").forEach((button) => {
      const moveX = gsap.quickTo(button, "x", { duration: 0.45, ease: "power3.out" });
      const moveY = gsap.quickTo(button, "y", { duration: 0.45, ease: "power3.out" });
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const bounds = button.getBoundingClientRect();
        moveX((event.clientX - bounds.left - bounds.width / 2) * 0.16);
        moveY((event.clientY - bounds.top - bounds.height / 2) * 0.2);
      };
      const leave = () => {
        moveX(0);
        moveY(0);
      };
      button.addEventListener("pointermove", move);
      button.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        button.removeEventListener("pointermove", move);
        button.removeEventListener("pointerleave", leave);
      });
    });
  }

  window.addEventListener(
    "pagehide",
    () => {
      cleanups.forEach((cleanup) => cleanup());
      context.revert();
    },
    { once: true },
  );
}
