import { Expertise } from "@/components/Expertise/Expertise";
import { CinematicLoader } from "@/components/Loader/CinematicLoader";
import { ReviewsSection } from "@/components/Reviews/ReviewsSection";
import { ContactSection } from "@/components/Contact/ContactSection";

const SPLINE_SCENE_URL =
  "https://my.spline.design/nexbotbyaximoriscopycopy-oyO8LNbqmXYAnmvmnJK91J3Z/?v=2";

const WHATSAPP_URL =
  "https://wa.me/923202729210?text=Hi%20Code%20N%20Site%2C%20I%20want%20a%20website%20for%20my%20business.%20Please%20share%20the%20details.";

const OUTBOUND_ARROW = "\u2197";

const NAV_ITEMS = [
  { label: "Expertise", href: "#expertise" },
  { label: "Selected work", href: "#work" },
  { label: "Studio", href: "#studio" },
] as const;

export default function Home() {
  return (
    <main className="site-shell">
      <CinematicLoader />
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Code N Site home">
          <span className="brand-mark" aria-hidden="true">
            C / N / S
          </span>
          <span>Code N Site</span>
        </a>

        <nav className="nav-links" aria-label="Main menu">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a className="project-link" href="mailto:hello@codensite.com">
          <span>Start project</span>
          <span aria-hidden="true">{OUTBOUND_ARROW}</span>
        </a>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="scene-frame" id="work">
          <iframe
            className="spline-scene"
            src={SPLINE_SCENE_URL}
            title="Code N Site interactive 3D robot experience"
            allow="autoplay; fullscreen"
          />
          <div className="scene-vignette" aria-hidden="true" />
          <div className="scene-grain" aria-hidden="true" />
        </div>

        <div className="hero-status" id="studio">
          <span className="status-dot" aria-hidden="true" />
          Independent digital studio / Available worldwide
        </div>

        <div className="hero-content" id="expertise">
          <p className="eyebrow">Strategy / Design / Engineering</p>
          <h1 id="hero-title">
            Digital products,
            <span> engineered to feel alive.</span>
          </h1>
          <p className="hero-copy">
            We create category-defining websites, software, AI experiences and
            digital systems for ambitious brands.
          </p>

          <div className="hero-actions">
            <a className="primary-action" href="mailto:hello@codensite.com">
              Build with us
              <span aria-hidden="true">{OUTBOUND_ARROW}</span>
            </a>
            <a className="secondary-action" href="#work">
              Explore the experience
            </a>
          </div>
        </div>

        <a className="scroll-cue" href="#expertise" aria-label="Scroll to studio introduction">
          <span>Scroll</span>
          <span className="scroll-line" aria-hidden="true" />
        </a>

        <a
          className="whatsapp-cover"
          href={WHATSAPP_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Code N Site on WhatsApp"
        >
          <span className="whatsapp-icon" aria-hidden="true">WA</span>
          <span className="whatsapp-copy">
            <span>WhatsApp</span>
            <span className="whatsapp-number">0320 2729210</span>
          </span>
          <span className="whatsapp-arrow" aria-hidden="true">{OUTBOUND_ARROW}</span>
        </a>
      </section>

      <Expertise />
      <ReviewsSection />
      <ContactSection />
    </main>
  );
}
