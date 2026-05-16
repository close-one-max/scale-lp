"use client";

import { useEffect, useRef } from "react";

// ── Konstanten ─────────────────────────────────────────────────────────────
const VIMEO_VIDEO_URL = ""; // Vimeo-URL hier eintragen, z.B. "https://player.vimeo.com/video/..."

// ── Meta Pixel helper ──────────────────────────────────────────────────────
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

// ── Design tokens (inline styles for brand colors) ─────────────────────────
const C = {
  whiteout: "#FBFBFB",
  caviar: "#2C2C2E",
  mindaro: "#DCF365",
  floatie: "#EAE8EC",
  dirtySnow: "#CBCDD5",
};

// ── Checkmark icon ─────────────────────────────────────────────────────────
function Check() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1.5 4L3.83 6.5L8.5 1.5"
        stroke={C.caviar}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Arrow icon (CTA button) ────────────────────────────────────────────────
function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke={C.caviar}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function Page() {
  const calSectionRef = useRef<HTMLElement>(null);
  const calEmbedRef = useRef<HTMLDivElement>(null);

  // iOS Safari: reset horizontal position on touch
  useEffect(() => {
    const onTouchMove = () => {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => window.removeEventListener("touchmove", onTouchMove);
  }, []);

  // CalendarView event when cal section enters viewport
  useEffect(() => {
    const el = calSectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track("CalendarView");
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cal.com script + element injection (client-only)
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.cal.com/embed/embed.js";
    script.async = true;
    document.body.appendChild(script);

    const container = calEmbedRef.current;
    if (container && container.children.length === 0) {
      const calEl = document.createElement("cal-inline");
      calEl.setAttribute("calLink", "close-one/30min");
      calEl.setAttribute(
        "config",
        JSON.stringify({ layout: "month_view", theme: "dark" })
      );
      calEl.style.width = "100%";
      calEl.style.minHeight = "600px";
      container.appendChild(calEl);
    }

    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const scrollToCal = () => {
    track("CtaClick");
    calSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        backgroundColor: C.whiteout,
        color: C.caviar,
        fontFamily:
          "var(--font-dm-sans), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {/* ═══════════════════════════════════════════════════════════════════
          Section 1 — Hero
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: C.whiteout }}
        className="min-h-screen flex flex-col"
      >
        {/* Nav */}
        <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center">
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-[8px] text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: C.mindaro, color: C.caviar }}
            >
              1
            </span>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ color: C.caviar }}
            >
              close one.
            </span>
          </div>
        </nav>

        {/* Hero content */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 py-16 sm:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: headline + CTA */}
              <div className="flex flex-col gap-7">
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08]"
                  style={{ color: C.caviar }}
                >
                  Vertrieb der skaliert —{" "}
                  <span style={{ color: C.caviar }}>
                    ohne neues Personal einzustellen.
                  </span>
                </h1>
                <p
                  className="text-lg sm:text-xl leading-relaxed max-w-xl"
                  style={{ color: C.caviar, opacity: 0.65 }}
                >
                  Wir bauen und betreiben dein komplettes KI-Vertriebssystem.
                  Du bekommst qualifizierte Termine — wir kümmern uns um den
                  Rest.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <button
                    onClick={scrollToCal}
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-[10px] text-base font-semibold transition-all duration-150 hover:opacity-90 active:scale-[0.97] cursor-pointer"
                    style={{
                      backgroundColor: C.mindaro,
                      color: C.caviar,
                      boxShadow: "0 2px 12px rgba(220,243,101,0.35)",
                    }}
                  >
                    Kostenlose Erstanalyse sichern
                    <ArrowRight />
                  </button>
                </div>
              </div>

              {/* Right: video placeholder (hidden on mobile) */}
              <div className="hidden lg:block">
                <div
                  className="relative w-full rounded-[12px] overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    backgroundColor: C.floatie,
                    border: `1px solid rgba(44,44,46,0.08)`,
                    boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
                  }}
                >
                  {VIMEO_VIDEO_URL ? (
                    <iframe
                      src={VIMEO_VIDEO_URL}
                      className="absolute inset-0 w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(44,44,46,0.08)" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M7 4.5l10 5.5-10 5.5V4.5z"
                            fill={C.caviar}
                            fillOpacity="0.45"
                          />
                        </svg>
                      </div>
                      <span
                        className="text-sm font-medium"
                        style={{ color: C.dirtySnow }}
                      >
                        Demo-Video folgt
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Section 2 — Pain Points
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.floatie }} className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-14"
            style={{ color: C.caviar }}
          >
            Kommt dir das bekannt vor?
          </h2>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: "📞",
                text: "Dein Vertriebsteam telefoniert Stunden — und generiert kaum Termine.",
              },
              {
                icon: "🔍",
                text: "Gute Leute im Vertrieb zu finden dauert Monate und kostet ein Vermögen.",
              },
              {
                icon: "📊",
                text: "Deine Pipeline ist unplanbar. Mal voll, mal leer. Umsatz schwankt.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 p-8 rounded-[12px]"
                style={{
                  backgroundColor: C.whiteout,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                }}
              >
                <span className="text-3xl leading-none">{item.icon}</span>
                <p
                  className="text-base leading-relaxed font-medium"
                  style={{ color: C.caviar }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Section 3 — Lösung
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.whiteout }} className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5"
              style={{ color: C.caviar }}
            >
              Andere verkaufen dir ein Tool und wünschen dir viel Glück.
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: C.caviar, opacity: 0.65 }}
            >
              Wir liefern dir ein komplettes Vertriebssystem — aufgebaut,
              betrieben, optimiert.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "🤖",
                title: "KI-Agents die Leads finden, qualifizieren und kontaktieren",
              },
              {
                icon: "🎙️",
                title: "Voice Agent der Outbound-Calls führt wie dein bester Closer",
              },
              {
                icon: "⚙️",
                title: "CRM-Anbindung, Follow-Ups, Pipeline — alles automatisiert",
              },
              {
                icon: "🇩🇪",
                title: "DSGVO-konform. DACH-optimiert. Auf Deutsch.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 p-6 rounded-[12px]"
                style={{
                  border: `1px solid rgba(44,44,46,0.08)`,
                  backgroundColor: C.whiteout,
                }}
              >
                <span className="text-2xl leading-none">{item.icon}</span>
                <p
                  className="text-sm font-medium leading-relaxed"
                  style={{ color: C.caviar }}
                >
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Section 4 — Ergebnisse / Social Proof
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.floatie }} className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-16"
            style={{ color: C.caviar }}
          >
            Ergebnisse die zählen.
          </h2>

          {/* Stats */}
          <div className="grid sm:grid-cols-3 gap-8 mb-20">
            {[
              { number: "+40%", label: "Conversion Rate" },
              { number: "24/7", label: "Lead-Bearbeitung" },
              { number: "90%", label: "Zeitersparnis" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div
                  className="text-5xl sm:text-6xl font-bold tracking-tight mb-2"
                  style={{ color: C.caviar }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-base font-medium"
                  style={{ color: C.caviar, opacity: 0.5 }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              "Unser SDR-Team qualifiziert jetzt nur noch Leads, die wirklich kaufbereit sind. Der Agent läuft durch — rund um die Uhr.",
              "Früher verbrachten wir täglich Stunden mit Erstkontakten. Heute filtert der Agent besser als jeder Mitarbeiter.",
              "Keine Anfrage geht mehr verloren. Interessenten buchen automatisch — auch wenn ich nachts schlafe.",
            ].map((quote, i) => (
              <div
                key={i}
                className="flex flex-col gap-5 p-8 rounded-[12px]"
                style={{
                  backgroundColor: C.whiteout,
                  boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  className="w-8 h-[3px] rounded-full"
                  style={{ backgroundColor: C.mindaro }}
                />
                <p
                  className="text-base leading-relaxed flex-1"
                  style={{ color: C.caviar }}
                >
                  &ldquo;{quote}&rdquo;
                </p>
                <p
                  className="text-xs font-medium uppercase tracking-widest"
                  style={{ color: C.dirtySnow }}
                >
                  B2B-Dienstleister, DACH
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Section 5 — Für wen ist das?
      ═══════════════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.whiteout }} className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-12"
              style={{ color: C.caviar }}
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
                    className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: C.mindaro }}
                  >
                    <Check />
                  </span>
                  <span
                    className="text-base font-medium leading-relaxed"
                    style={{ color: C.caviar }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p
              className="text-sm leading-relaxed"
              style={{ color: C.dirtySnow }}
            >
              Kein Fit? Kein Problem. Unser scout CRM ist kostenlos für bis zu
              500 Kontakte.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Section 6 — CTA + Cal.com
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={calSectionRef}
        id="termin"
        style={{ backgroundColor: C.caviar }}
        className="py-24 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5"
              style={{ color: C.whiteout }}
            >
              Lass uns in 30 Minuten herausfinden, ob wir dein Vertriebssystem
              bauen können.
            </h2>
            <p
              className="text-lg leading-relaxed"
              style={{ color: C.dirtySnow }}
            >
              Kostenlos. Unverbindlich. Kein Pitch — sondern eine ehrliche
              Analyse deiner Situation.
            </p>
          </div>

          {/* Cal.com embed injected via useEffect */}
          <div ref={calEmbedRef} className="w-full" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Section 7 — Footer
      ═══════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          backgroundColor: C.caviar,
          borderTop: "1px solid rgba(251,251,251,0.08)",
        }}
        className="py-8"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-center text-sm"
            style={{ color: C.dirtySnow }}
          >
            © 2026 close one.&nbsp; | &nbsp;info@close-one.de&nbsp; |{" "}
            <a
              href="https://close-one.de/impressum"
              style={{ color: C.dirtySnow }}
              className="hover:opacity-80 transition-opacity underline underline-offset-2"
            >
              Impressum
            </a>{" "}
            |{" "}
            <a
              href="https://close-one.de/datenschutz"
              style={{ color: C.dirtySnow }}
              className="hover:opacity-80 transition-opacity underline underline-offset-2"
            >
              Datenschutz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
