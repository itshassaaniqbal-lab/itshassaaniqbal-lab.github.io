import type { CSSProperties } from "react";
import Script from "next/script";
import { ExpertiseContent } from "./ExpertiseContent";

type DustStyle = CSSProperties & {
  "--dust-alpha": string;
  "--dust-size": string;
  "--dust-x": string;
  "--dust-y": string;
};

const DUST_PARTICLES = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  style: {
    "--dust-alpha": `${0.18 + ((index * 13) % 28) / 100}`,
    "--dust-size": `${1 + ((index * 17) % 3)}px`,
    "--dust-x": `${4 + ((index * 37) % 92)}%`,
    "--dust-y": `${6 + ((index * 53) % 88)}%`,
  } as DustStyle,
}));

const MODEL_FRAME_DOCUMENT = `<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#expertise-model-root,.expertise-canvas{width:100%;height:100%;margin:0;overflow:hidden;background:transparent}body{color:#fff;font-family:Arial,sans-serif}</style></head><body><div id="expertise-model-root"></div><script type="module" src="/expertise-model.js"></script></body></html>`;

export function Expertise() {
  return (
    <section className="expertise-section" id="our-expertise" aria-labelledby="expertise-title">
      <div className="expertise-background" aria-hidden="true">
        <span className="expertise-glow expertise-glow-purple" data-expertise-glow="purple" />
        <span className="expertise-glow expertise-glow-blue" data-expertise-glow="blue" />
        <span className="expertise-fog" data-expertise-fog />
        <span className="expertise-noise" />
        <span className="expertise-grid-lines" />
        {DUST_PARTICLES.map((particle) => (
          <span
            className="expertise-dust"
            data-expertise-dust
            key={particle.id}
            style={particle.style}
          />
        ))}
      </div>

      <div className="expertise-layout">
        <div className="expertise-model-column" data-expertise-model>
          <div className="expertise-model-glass" aria-hidden="true" />
          <iframe
            className="expertise-model-frame"
            srcDoc={MODEL_FRAME_DOCUMENT}
            title="Interactive robotic girl representing Code N Site expertise"
            loading="lazy"
            allow="fullscreen"
          />
          <div className="expertise-model-caption" aria-hidden="true">
            <span>Interactive system</span>
            <span>Drag to rotate 360°</span>
          </div>
        </div>

        <ExpertiseContent />
      </div>
      <Script src="/expertise-motion.js" strategy="afterInteractive" />
    </section>
  );
}
