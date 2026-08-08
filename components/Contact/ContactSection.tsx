"use client";

import { type FormEvent, useState } from "react";
import type { IconType } from "react-icons";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { useSectionReveal } from "@/hooks/useSectionReveal";

const WHATSAPP_NUMBER = "923202729210";

interface SocialChannel {
  readonly icon: IconType;
  readonly label: string;
  readonly href: string;
  readonly className: "instagram" | "facebook";
}

const SOCIAL_CHANNELS: readonly SocialChannel[] = [
  {
    icon: FaInstagram,
    label: "Instagram",
    href: "https://www.instagram.com/codeandsites",
    className: "instagram",
  },
  {
    icon: FaFacebookF,
    label: "Facebook",
    href: "https://www.facebook.com/codeandsites",
    className: "facebook",
  },
];

function getFormValue(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function ContactSection() {
  const [submissionStatus, setSubmissionStatus] = useState("");
  const sectionRef = useSectionReveal<HTMLElement>();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const message = [
      "Hi Code N Site, I want to discuss a new project.",
      "",
      `Name: ${getFormValue(formData, "name")}`,
      `Email: ${getFormValue(formData, "email")}`,
      `Company: ${getFormValue(formData, "company") || "Not specified"}`,
      `Project: ${getFormValue(formData, "projectType")}`,
      `Budget: ${getFormValue(formData, "budget")}`,
      "",
      `Brief: ${getFormValue(formData, "message")}`,
    ].join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSubmissionStatus("Your project brief is ready in WhatsApp.");
  };

  return (
    <section
      ref={sectionRef}
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-orb contact-orb--purple" aria-hidden="true" />
      <div className="contact-orb contact-orb--blue" aria-hidden="true" />

      <div className="section-shell contact-shell">
        <div className="contact-intro section-reveal-item">
          <p className="section-kicker"><span />Start a conversation</p>
          <h2 id="contact-title">
            Have an idea?
            <span>Let’s make it impossible to ignore.</span>
          </h2>
          <p className="contact-intro__copy">
            Tell us what you’re building, where you want to go and what success
            should feel like. We’ll turn the ambition into a clear digital plan.
          </p>

          <div className="social-stage" aria-label="Code N Site social channels">
            <div className="social-stage__copy">
              <span>Find us online</span>
              <strong>Social, but dimensional.</strong>
            </div>
            <div className="social-icons-3d">
              {SOCIAL_CHANNELS.map((channel) => {
                const SocialIcon = channel.icon;

                return (
                  <a
                    key={channel.label}
                    className={`social-icon-3d social-icon-3d--${channel.className}`}
                    href={channel.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Connect with Code N Site via ${channel.label}`}
                  >
                    <span className="social-icon-3d__cube" aria-hidden="true">
                      <SocialIcon focusable="false" />
                    </span>
                    <span className="social-icon-3d__label">{channel.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <div className="contact-direct">
            <a href="mailto:codeandsite@gmail.com">
              <span>Email</span>
              <strong>Codeandsite@gmail.com</strong>
            </a>
            <a
              href="https://wa.me/923202729210"
              target="_blank"
              rel="noreferrer"
            >
              <span>WhatsApp</span>
              <strong>+92 320 2729210</strong>
            </a>
          </div>
        </div>

        <div className="contact-form-panel section-reveal-item">
          <div className="contact-form-panel__topline">
            <span>Project inquiry</span>
            <span><i aria-hidden="true" /> Accepting select projects</span>
          </div>

          <form id="contact-form" className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <label>
                <span>Your name *</span>
                <input name="name" type="text" autoComplete="name" required placeholder="John Doe" />
              </label>
              <label>
                <span>Email address *</span>
                <input name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
              </label>
            </div>

            <label>
              <span>Company / brand</span>
              <input name="company" type="text" autoComplete="organization" placeholder="Your company" />
            </label>

            <div className="contact-form__row">
              <label>
                <span>What are we building? *</span>
                <select name="projectType" required defaultValue="">
                  <option value="" disabled>Select project type</option>
                  <option>Premium Website</option>
                  <option>Software Platform</option>
                  <option>AI Solution</option>
                  <option>Mobile Application</option>
                  <option>SaaS Product</option>
                  <option>Automation System</option>
                  <option>Other Digital Experience</option>
                </select>
              </label>
              <label>
                <span>Estimated budget *</span>
                <select name="budget" required defaultValue="">
                  <option value="" disabled>Select investment</option>
                  <option>$5k – $15k</option>
                  <option>$15k – $30k</option>
                  <option>$30k – $75k</option>
                  <option>$75k+</option>
                  <option>Let’s discuss</option>
                </select>
              </label>
            </div>

            <label>
              <span>Tell us about the project *</span>
              <textarea
                name="message"
                rows={5}
                required
                placeholder="The ambition, challenge, timeline and what success looks like..."
              />
            </label>

            <div className="contact-form__footer">
              <p aria-live="polite">{submissionStatus || "We usually reply within one business day."}</p>
              <button type="submit">
                Send project brief
                <span aria-hidden="true">↗</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="site-footer section-shell">
        <a className="site-footer__brand" href="#top">
          <span>C / N / S</span>
          <strong>Code N Site</strong>
        </a>
        <p>Strategy · Design · Engineering · AI</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
