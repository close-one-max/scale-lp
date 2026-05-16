"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// ── Vimeo ──────────────────────────────────────────────────────────────────
const VIMEO_SRC =
  "https://player.vimeo.com/video/1192877515?badge=0&autopause=0&player_id=0&app_id=58479";

// ── CSS-Variablen (Farben) ─────────────────────────────────────────────────
const V = {
  darkBg:     "#1A1A1C",
  lightBg:    "#FBFBFB",
  accent:     "#DCF365",
  textLight:  "#FBFBFB",
  textDark:   "#2C2C2E",
  mutedDark:  "rgba(255,255,255,0.5)",
  mutedLight: "rgba(0,0,0,0.5)",
  cardDarkBg: "rgba(255,255,255,0.04)",
  cardBorder: "1px solid rgba(255,255,255,0.08)",
  floatie:    "#EAE8EC",
  snow:       "#CBCDD5",
} as const;

// ── Meta Pixel ─────────────────────────────────────────────────────────────
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
  }
}
function track(event: string) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("trackCustom", event);
  }
}

// ── Badge-Komponenten ──────────────────────────────────────────────────────
function DarkBadge({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="uppercase tracking-[0.2em] mb-5"
      style={{ color: V.accent, fontSize: "12px", fontWeight: 600 }}
    >
      {children}
    </p>
  );
}

function LightBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block uppercase tracking-[0.2em] rounded-full mb-5"
      style={{
        color: V.textDark,
        fontSize: "12px",
        fontWeight: 600,
        border: "1px solid rgba(0,0,0,0.15)",
        padding: "4px 14px",
      }}
    >
      {children}
    </span>
  );
}

// ── Checkmark ─────────────────────────────────────────────────────────────
function Check() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1.5 4L3.83 6.5L8.5 1.5"
        stroke={V.textDark}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
export default function Page() {
  const calSectionRef = useRef<HTMLElement>(null);
  const calEmbedRef   = useRef<HTMLDivElement>(null);

  // iOS Safari: prevent horizontal drift
  useEffect(() => {
    const fn = () => {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
    };
    window.addEventListener("touchmove", fn, { passive: false });
    return () => window.removeEventListener("touchmove", fn);
  }, []);

  // Scroll fade-in mit staggered delay
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-fade]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = parseInt(el.dataset.fadeDelay ?? "0");
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, delay);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // CalendarView pixel event
  useEffect(() => {
    const el = calSectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("CalendarView");
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Cal.com embed
  useEffect(() => {
    const s = document.createElement("script");
    s.src   = "https://app.cal.com/embed/embed.js";
    s.async = true;
    document.body.appendChild(s);

    const c = calEmbedRef.current;
    if (c && c.children.length === 0) {
      const el = document.createElement("cal-inline");
      el.setAttribute("calLink", "close-one/30min");
      el.setAttribute("config", JSON.stringify({ layout: "month_view", theme: "dark" }));
      el.style.width     = "100%";
      el.style.minHeight = "600px";
      c.appendChild(el);
    }
    return () => {
      if (document.body.contains(s)) document.body.removeChild(s);
    };
  }, []);

  const scrollToCal = () => {
    track("CtaClick");
    calSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "var(--font-dm-sans), 'DM Sans', system-ui, sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════
          1 · HERO — DUNKEL
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: V.darkBg }}
      >
        {/* Nav */}
        <nav className="lp-wrap flex items-center py-6">
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-[8px] text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: V.accent, color: V.textDark }}
            >
              1
            </span>
            <span className="text-lg font-semibold tracking-tight" style={{ color: V.textLight }}>
              close one.
            </span>
          </div>
        </nav>

        {/* Body */}
        <div className="flex-1 flex items-center">
          <div className="lp-wrap w-full py-12 sm:py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Text */}
              <div className="flex flex-col gap-6 md:gap-7">

                {/* Badge mit Pulse-Dot */}
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full self-start"
                  style={{ backgroundColor: V.accent }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                    style={{ backgroundColor: V.textDark }}
                  />
                  <span
                    className="uppercase tracking-[0.15em]"
                    style={{ color: V.textDark, fontSize: "12px", fontWeight: 600 }}
                  >
                    KI-Vertriebssystem für B2B
                  </span>
                </div>

                {/* Headline */}
                <h1
                  className="font-bold tracking-tight leading-[1.1]"
                  style={{
                    color: V.textLight,
                    fontSize: "clamp(32px, 5vw, 56px)",
                  }}
                >
                  Vertrieb der skaliert —{" "}
                  <span
                    className="rounded-sm"
                    style={{
                      backgroundColor: V.accent,
                      color: V.textDark,
                      padding: "2px 8px",
                    }}
                  >
                    ohne neues Personal.
                  </span>
                </h1>

                {/* Subheadline */}
                <p
                  className="font-light leading-relaxed"
                  style={{ color: V.mutedDark, fontSize: "18px", maxWidth: "500px" }}
                >
                  Wir bauen und betreiben dein komplettes KI-Vertriebssystem.
                  Du bekommst qualifizierte Termine — wir kümmern uns um den Rest.
                </p>

                {/* CTA */}
                <div>
                  <button
                    onClick={scrollToCal}
                    className="font-semibold cursor-pointer"
                    style={{
                      backgroundColor: V.accent,
                      color: V.textDark,
                      padding: "16px 32px",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: 600,
                      border: "none",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                      boxShadow: "0 4px 20px rgba(220,243,101,0.3)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)";
                      e.currentTarget.style.boxShadow = "0 8px 36px rgba(220,243,101,0.5)";
                      e.currentTarget.style.backgroundColor = "#c9e04a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow = "0 4px 20px rgba(220,243,101,0.3)";
                      e.currentTarget.style.backgroundColor = V.accent;
                    }}
                  >
                    Kostenlose Erstanalyse sichern →
                  </button>
                </div>

                {/* Trust-Punkte */}
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {[
                    "Kostenlos & unverbindlich",
                    "Kein Pitch",
                    "DSGVO-konform",
                    "DACH-optimiert",
                  ].map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-1.5"
                      style={{ color: V.mutedDark, fontSize: "13px" }}
                    >
                      <span style={{ color: V.accent, fontWeight: 700, fontSize: "10px" }}>●</span>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vimeo */}
              <div
                className="relative w-full"
                style={{
                  aspectRatio: "16/9",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
                }}
              >
                <iframe
                  src={VIMEO_SRC}
                  title="close one. Demo"
                  className="absolute inset-0 w-full h-full"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  allowFullScreen
                  style={{ border: 0 }}
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2 · TRUST BAR — DUNKEL (border-top)
      ═══════════════════════════════════════════════════════════════ */}
      <div
        data-fade
        className="py-6"
        style={{
          backgroundColor: V.darkBg,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="lp-wrap">
          <div className="flex flex-wrap justify-center items-center gap-y-3 gap-x-10 sm:gap-x-16">
            {[
              { value: "+40%", label: "Conversion Rate" },
              { value: "24/7", label: "Lead-Bearbeitung" },
              { value: "90%",  label: "Zeitersparnis"   },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: V.textLight }}>
                  {stat.value}
                </span>
                <span className="text-sm" style={{ color: V.mutedDark }}>
                  {stat.label}
                </span>
                {i < 2 && (
                  <span
                    className="hidden sm:block w-px h-4 ml-4"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          3 · PAIN POINTS — HELL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: V.lightBg }}>
        <div className="lp-wrap">
          <div data-fade className="text-center mb-14">
            <LightBadge>Der Vertriebsalltag heute</LightBadge>
            <h2
              className="font-bold tracking-tight leading-[1.1]"
              style={{ color: V.textDark, fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Kommt dir das bekannt vor?
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              "Dein Vertriebsteam telefoniert Stunden — und generiert kaum Termine.",
              "Gute Leute im Vertrieb zu finden dauert Monate und kostet ein Vermögen.",
              "Deine Pipeline ist unplanbar. Mal voll, mal leer. Umsatz schwankt.",
            ].map((text, i) => (
              <div
                key={i}
                data-fade
                data-fade-delay={String(i * 100)}
                className="cursor-default"
                style={{
                  backgroundColor: V.lightBg,
                  border: `1px solid ${V.floatie}`,
                  borderRadius: "16px",
                  padding: "32px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                }}
              >
                {/* Mindaro accent stripe */}
                <div
                  style={{
                    width: "40px",
                    height: "4px",
                    backgroundColor: V.accent,
                    borderRadius: "2px",
                    marginBottom: "20px",
                  }}
                />
                <p
                  className="font-medium leading-relaxed"
                  style={{ color: V.textDark, fontSize: "16px", lineHeight: 1.6 }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4 · LÖSUNG — DUNKEL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: V.darkBg }}>
        <div className="lp-wrap">
          <div data-fade className="text-center mb-14">
            <DarkBadge>Die Lösung</DarkBadge>
            <h2
              className="font-bold tracking-tight leading-[1.1] mb-5"
              style={{ color: V.textLight, fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Andere verkaufen dir ein Tool{" "}
              <span
                className="rounded-sm"
                style={{ backgroundColor: V.accent, color: V.textDark, padding: "2px 8px" }}
              >
                und wünschen dir viel Glück.
              </span>
            </h2>
            <p
              className="font-light leading-relaxed mx-auto"
              style={{ color: V.mutedDark, fontSize: "18px", maxWidth: "560px" }}
            >
              Wir liefern dir ein komplettes Vertriebssystem — aufgebaut, betrieben, optimiert.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              "KI-Agents die Leads finden, qualifizieren und kontaktieren",
              "Voice Agent der Outbound-Calls führt wie dein bester Closer",
              "CRM-Anbindung, Follow-Ups, Pipeline — alles automatisiert",
              "DSGVO-konform. DACH-optimiert. Auf Deutsch.",
            ].map((title, i) => (
              <div
                key={i}
                data-fade
                data-fade-delay={String(i * 100)}
                className="flex items-stretch gap-4 cursor-default"
                style={{
                  backgroundColor: V.cardDarkBg,
                  border: V.cardBorder,
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "transform 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.07)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = V.cardDarkBg;
                }}
              >
                {/* Mindaro vertical bar */}
                <div
                  style={{
                    width: "4px",
                    flexShrink: 0,
                    backgroundColor: V.accent,
                    borderRadius: "2px",
                  }}
                />
                <p
                  className="font-medium leading-relaxed"
                  style={{ color: V.textLight, fontSize: "14px", lineHeight: 1.6 }}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5 · ERGEBNISSE + TESTIMONIALS — DUNKEL (visuell abgesetzt)
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="py-24"
        style={{
          backgroundColor: V.darkBg,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="lp-wrap">
          <div data-fade className="text-center mb-16">
            <DarkBadge>Ergebnisse</DarkBadge>
            <h2
              className="font-bold tracking-tight leading-[1.1]"
              style={{ color: V.textLight, fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Ergebnisse die zählen.
            </h2>
          </div>

          {/* Zahlen */}
          <div className="grid sm:grid-cols-3 gap-10 mb-20">
            {[
              { number: "+40%", label: "Conversion Rate" },
              { number: "24/7", label: "Lead-Bearbeitung" },
              { number: "90%",  label: "Zeitersparnis"   },
            ].map((stat, i) => (
              <div key={i} data-fade data-fade-delay={String(i * 100)}>
                <div
                  className="font-extrabold leading-none"
                  style={{
                    color: V.accent,
                    fontSize: "clamp(48px, 6vw, 72px)",
                    marginBottom: "8px",
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="uppercase tracking-[0.2em]"
                  style={{ color: V.mutedDark, fontSize: "12px", fontWeight: 600 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              "Unser SDR-Team qualifiziert jetzt nur noch Leads, die wirklich kaufbereit sind. Der Agent läuft durch — rund um die Uhr.",
              "Früher verbrachten wir täglich Stunden mit Erstkontakten. Heute filtert der Agent besser als jeder Mitarbeiter.",
              "Keine Anfrage geht mehr verloren. Interessenten buchen automatisch — auch wenn ich nachts schlafe.",
            ].map((quote, i) => (
              <div
                key={i}
                data-fade
                data-fade-delay={String(i * 100)}
                className="flex flex-col gap-5 cursor-default"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  padding: "32px",
                  transition: "transform 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
                }}
              >
                <span
                  className="leading-none"
                  style={{
                    color: V.accent,
                    fontSize: "48px",
                    fontFamily: "Georgia, serif",
                    fontWeight: 300,
                    lineHeight: 1,
                  }}
                >
                  &ldquo;
                </span>
                <p
                  className="font-light leading-relaxed italic flex-1"
                  style={{ color: V.textLight, fontSize: "16px", lineHeight: 1.7 }}
                >
                  {quote}
                </p>
                <p
                  className="uppercase tracking-[0.2em]"
                  style={{ color: V.accent, fontSize: "11px", fontWeight: 600 }}
                >
                  B2B-DIENSTLEISTER, DACH
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          6 · FÜR WEN — HELL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24" style={{ backgroundColor: V.lightBg }}>
        <div className="lp-wrap">
          <div data-fade className="max-w-2xl">
            <LightBadge>Passt das zu dir?</LightBadge>
            <h2
              className="font-bold tracking-tight leading-[1.1] mb-10"
              style={{ color: V.textDark, fontSize: "clamp(28px, 4vw, 48px)" }}
            >
              Für B2B-Unternehmen die wachsen wollen.
            </h2>

            <ul className="flex flex-col gap-5 mb-10">
              {[
                "B2B-Dienstleister im DACH-Raum",
                "11 bis 100+ Mitarbeiter",
                "Erklärungsbedürftige Produkte oder Services",
                "IT, Beratung, Personaldienstleistung, SaaS, Industrie",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex items-center justify-center flex-shrink-0 rounded-full mt-0.5"
                    style={{
                      backgroundColor: V.accent,
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <Check />
                  </span>
                  <span
                    className="font-medium leading-relaxed"
                    style={{ color: V.textDark, fontSize: "16px", lineHeight: 1.6 }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="font-light" style={{ color: V.mutedLight, fontSize: "14px" }}>
              Kein Fit? Kein Problem. Unser scout CRM ist kostenlos für bis zu 500 Kontakte.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          7 · CTA + CAL.COM — DUNKEL
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={calSectionRef}
        id="termin"
        style={{
          backgroundColor: V.darkBg,
          paddingTop: "120px",
          paddingBottom: "80px",
        }}
      >
        <div className="lp-wrap">
          <div
            data-fade
            className="text-center mx-auto mb-14"
            style={{ maxWidth: "640px" }}
          >
            <DarkBadge>Jetzt starten</DarkBadge>
            <h2
              className="font-bold tracking-tight leading-[1.15] mb-5"
              style={{ color: V.textLight, fontSize: "clamp(24px, 3.5vw, 44px)" }}
            >
              Lass uns in 30 Minuten herausfinden, ob wir dein Vertriebssystem
              bauen können.
            </h2>
            <p
              className="font-light leading-relaxed"
              style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px" }}
            >
              Kostenlos. Unverbindlich. Kein Pitch — sondern eine ehrliche
              Analyse deiner Situation.
            </p>
          </div>
          <div ref={calEmbedRef} className="w-full" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          8 · GRÜNDER — HELL
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: V.lightBg }}>
        <div className="lp-wrap">
          <div
            data-fade
            className="flex flex-col sm:flex-row items-center sm:items-start gap-8 sm:gap-10 max-w-2xl mx-auto"
          >
            {/* Portrait 120×120 mit Mindaro-Border */}
            <div
              className="relative flex-shrink-0 self-center sm:self-start"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                border: `3px solid ${V.accent}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="/hero-dragan.png"
                alt="Dragan Matijević"
                fill
                className="object-cover object-top"
                sizes="120px"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <span
                className="inline-block uppercase tracking-[0.2em] rounded-full self-center sm:self-start"
                style={{
                  color: V.textDark,
                  fontSize: "12px",
                  fontWeight: 600,
                  border: "1px solid rgba(0,0,0,0.15)",
                  padding: "4px 14px",
                }}
              >
                Founder · Sales · AI
              </span>

              <div>
                <p className="font-bold" style={{ color: V.textDark, fontSize: "24px", lineHeight: 1.2 }}>
                  Dragan Matijević
                </p>
                <p className="font-medium" style={{ color: V.mutedLight, fontSize: "14px", marginTop: "4px" }}>
                  Gründer &amp; CEO — 30+ Jahre B2B-Vertrieb
                </p>
              </div>

              <p
                className="font-light leading-relaxed"
                style={{ color: V.textDark, fontSize: "16px", lineHeight: 1.7, opacity: 0.7 }}
              >
                &ldquo;Ich weiß, dass ein schlagkräftiger Vertrieb der
                Überlebensgarant für jedes Unternehmen ist. Deshalb baue ich
                AI-Systeme, die Sales-Teams besser, schneller und unabhängiger
                machen.&rdquo;
              </p>

              <p
                className="font-medium"
                style={{ color: V.mutedLight, fontSize: "14px" }}
              >
                32+ Jahre Vertrieb &nbsp;·&nbsp; 3 Exits &nbsp;·&nbsp; 200+ B2B-Kampagnen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          9 · FOOTER — DUNKEL
      ═══════════════════════════════════════════════════════════════ */}
      <footer
        className="py-8"
        style={{
          backgroundColor: V.darkBg,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div className="lp-wrap">
          <p className="text-center text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
            © 2026 close one.&nbsp; | &nbsp;info@close-one.de&nbsp; |{" "}
            <a
              href="https://close-one.de/impressum"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = V.textLight; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
            >
              Impressum
            </a>{" "}
            |{" "}
            <a
              href="https://close-one.de/datenschutz"
              style={{ color: "rgba(255,255,255,0.4)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = V.textLight; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.4)"; }}
            >
              Datenschutz
            </a>
          </p>
        </div>
      </footer>

    </div>
  );
}
