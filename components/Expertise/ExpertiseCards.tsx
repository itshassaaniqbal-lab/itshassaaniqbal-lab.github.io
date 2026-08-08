interface Service {
  code: string;
  name: string;
}

const SERVICES: readonly Service[] = [
  { code: "SW", name: "Software Development" },
  { code: "AI", name: "AI Solutions" },
  { code: "WEB", name: "Website Development" },
  { code: "APP", name: "Mobile Applications" },
  { code: "SAAS", name: "SaaS Platforms" },
  { code: "UX", name: "UI / UX Design" },
  { code: "GAME", name: "Game Development" },
  { code: "CLD", name: "Cloud Solutions" },
  { code: "API", name: "API Development" },
  { code: "AUTO", name: "Automation" },
  { code: "OPS", name: "DevOps" },
  { code: "SEC", name: "Cyber Security" },
] as const;

export function ExpertiseCards() {
  return (
    <div className="expertise-cards" id="expertise-grid" aria-label="Code N Site services">
      {SERVICES.map((service, index) => (
        <article className="expertise-card" data-expertise-card key={service.name}>
          <span className="expertise-card-index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="expertise-card-icon" aria-hidden="true">
            {service.code}
          </span>
          <h3>{service.name}</h3>
          <span className="expertise-card-arrow" aria-hidden="true">+</span>
        </article>
      ))}
    </div>
  );
}
