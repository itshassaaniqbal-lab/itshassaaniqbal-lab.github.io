import { ExpertiseButtons } from "./ExpertiseButtons";
import { ExpertiseCards } from "./ExpertiseCards";
import { ExpertiseStats } from "./ExpertiseStats";

export function ExpertiseContent() {
  return (
    <div className="expertise-content">
      <header className="expertise-heading" data-expertise-heading>
        <p className="expertise-kicker">
          <span aria-hidden="true" />
          What we build
        </p>
        <h2 id="expertise-title">
          Building Powerful Digital Solutions
          <span> For Modern Businesses.</span>
        </h2>
        <p className="expertise-description">
          Code N Site combines strategy, design and engineering to create high-performance software,
          intelligent AI products and digital platforms that help ambitious businesses lead their markets.
        </p>
      </header>

      <ExpertiseCards />
      <ExpertiseStats />
      <ExpertiseButtons />
    </div>
  );
}
