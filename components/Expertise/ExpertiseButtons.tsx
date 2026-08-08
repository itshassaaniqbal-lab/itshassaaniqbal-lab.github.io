export function ExpertiseButtons() {
  return (
    <div className="expertise-buttons" data-expertise-buttons>
      <a
        className="expertise-button expertise-button-primary"
        data-magnetic-button
        href="mailto:hello@codensite.com"
      >
        <span>Let&apos;s Build Together</span>
        <span aria-hidden="true">+</span>
      </a>
      <a
        className="expertise-button expertise-button-secondary"
        data-magnetic-button
        href="#expertise-grid"
      >
        <span>Explore Services</span>
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  );
}
