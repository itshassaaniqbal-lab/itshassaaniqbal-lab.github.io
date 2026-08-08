const STATS = [
  { numericValue: 100, suffix: "+", label: "Projects Delivered" },
  { numericValue: 98, suffix: "%", label: "Client Satisfaction" },
  { numericValue: 5, suffix: "+", label: "Years Experience" },
  { numericValue: null, suffix: "24/7", label: "Support" },
] as const;

export function ExpertiseStats() {
  return (
    <div className="expertise-stats" aria-label="Agency statistics">
      {STATS.map((stat) => (
        <article className="expertise-stat" data-expertise-stat key={stat.label}>
          <strong
            data-stat-value
            data-count={stat.numericValue ?? undefined}
            data-suffix={stat.numericValue === null ? undefined : stat.suffix}
          >
            {stat.numericValue === null ? stat.suffix : `0${stat.suffix}`}
          </strong>
          <span>{stat.label}</span>
        </article>
      ))}
    </div>
  );
}
