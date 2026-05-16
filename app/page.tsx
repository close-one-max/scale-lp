"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// ── Konstanten ─────────────────────────────────────────────────────────────
const VIMEO_SRC =
  "https://player.vimeo.com/video/1192877515?badge=0&autopause=0&player_id=0&app_id=58479";

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

// ── Brand colors ───────────────────────────────────────────────────────────
const C = {
  whiteout: "#FBFBFB",
  caviar: "#2C2C2E",
  mindaro: "#DCF365",
  floatie: "#EAE8EC",
  dirtySnow: "#CBCDD5",
};

// ── Small icons ────────────────────────────────────────────────────────────
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

// ── Hover helpers (inline style, avoids Tailwind v4 purge issues) ──────────
function cardHoverOn(e: React.MouseEvent<HTMLDivElement>) {
  const el = e.currentTarget;
  el.style.transform = "scale(1.02)";
  el.style.boxShadow = "0 10px 40px rgba(0,0,0,0.11)";
}
function cardHoverOff(
  e: React.MouseEvent<HTMLDivElement>,
  shadow = "0 2px 12px rgba(0,0,0,0.05)"
) {
  const el = e.currentTarget;
  el.style.transform = "scale(1)";
  el.style.boxShadow = shadow;
}

// ═══════════════════════════════════════════════════════════════════════════
export default function Page() {
  const calSectionRef = useRef<HTMLElement>(null);
  const calEmbedRef = useRef<HTMLDivElement>(null);

  // iOS Safari: prevent horizontal drift on touchmove
  useEffect(() => {
    const onTouchMove = () => {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
    };
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => window.removeEventListener("touchmove", onTouchMove);
  }, []);

  // Scroll fade-in for all [data-fade] elements
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-fade]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(24px)";
      el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // CalendarView pixel event
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

  // Cal.com embed injection
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
          Hero
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

        {/* Hero body */}
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-7xl mx-auto px-6 py-12 sm:py-16">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              {/* Left: text */}
              <div className="flex flex-col gap-7 lg:pt-2">
                <span
                  className="inline-block self-start text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: C.floatie, color: C.caviar }}
                >
                  KI-Vertriebssystem für B2B
                </span>

                <h1
                  className="text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold tracking-tight leading-[1.08]"
                  style={{ color: C.caviar }}
                >
                  Vertrieb der skaliert — ohne neues Personal einzustellen.
                </h1>

                <p
                  className="text-lg leading-relaxed"
                  style={{ color: C.caviar, opacity: 0.65 }}
                >
                  Wir bauen und betreiben dein komplettes KI-Vertriebssystem.
                  Du bekommst qualifizierte Termine — wir kümmern uns um den
                  Rest.
                </p>

                <div>
                  <button
                    onClick={scrollToCal}
                    className="inline-flex items-center gap-2.5 px-7 py-4 rounded-[10px] text-base font-semibold cursor-pointer"
                    style={{
                      backgroundColor: C.mindaro,
                      color: C.caviar,
                      boxShadow: "0 2px 14px rgba(220,243,101,0.4)",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow =
                        "0 6px 28px rgba(220,243,101,0.6)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 14px rgba(220,243,101,0.4)";
                    }}
                  >
                    Kostenlose Erstanalyse sichern
                    <ArrowRight />
                  </button>
                </div>

                <p className="text-sm" style={{ color: C.dirtySnow }}>
                  Für IT-Dienstleister, Beratungen, SaaS und Industrie im
                  DACH-Raum
                </p>
              </div>

              {/* Right: Vimeo + studio image */}
              <div className="flex flex-col gap-4">
                {/* Vimeo 16:9 */}
                <div
                  className="relative w-full rounded-[12px] overflow-hidden"
                  style={{
                    aspectRatio: "16/9",
                    boxShadow: "0 8px 48px rgba(0,0,0,0.14)",
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

                {/* Studio shot below video — trust element */}
                <div
                  className="relative w-full rounded-[10px] overflow-hidden hidden lg:block"
                  style={{
                    aspectRatio: "16/9",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                  }}
                >
                  <Image
                    src="/hero-studio.png"
                    alt="close one. Produktion"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Trust Bar
      ═══════════════════════════════════════════════════════════════════ */}
      <div
        data-fade
        style={{
          backgroundColor: C.floatie,
          borderTop: `1px solid rgba(44,44,46,0.06)`,
          borderBottom: `1px solid rgba(44,44,46,0.06)`,
        }}
        className="py-5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-center items-center gap-y-3 gap-x-6 sm:gap-x-12">
            {[
              { value: "+40%", label: "Conversion Rate" },
              { value: "24/7", label: "Lead-Bearbeitung" },
              { value: "90%", label: "Zeitersparnis" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className="text-lg font-bold"
                  style={{ color: C.caviar }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-sm font-medium"
                  style={{ color: C.caviar, opacity: 0.5 }}
                >
                  {stat.label}
                </span>
                {i < 2 && (
                  <span
                    className="hidden sm:block w-px h-4 ml-4"
                    style={{ backgroundColor: `rgba(44,44,46,0.2)` }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          Pain Points
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: C.floatie }}
        className="py-24 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header row with stopwatch image */}
          <div
            data-fade
            className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start sm:items-center mb-14"
          >
            <h2
              className="flex-1 text-3xl sm:text-4xl font-semibold tracking-tight"
              style={{ color: C.caviar }}
            >
              Kommt dir das bekannt vor?
            </h2>
            <div
              className="relative w-40 h-40 rounded-[12px] overflow-hidden flex-shrink-0 hidden sm:block"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.09)" }}
            >
              <Image
                src="/stopwatch.png"
                alt="Zeit im Vertrieb"
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          </div>

          {/* Cards */}
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
                data-fade
                className="flex flex-col gap-5 p-8 rounded-[12px] cursor-default"
                style={{
                  backgroundColor: C.whiteout,
                  border: `1px solid rgba(44,44,46,0.07)`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={cardHoverOn}
                onMouseLeave={(e) => cardHoverOff(e)}
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
          Lösung
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: C.whiteout }}
        className="py-24 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div data-fade className="max-w-3xl mx-auto text-center mb-12">
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

          {/* Process flow image */}
          <div
            data-fade
            className="relative w-full rounded-[12px] overflow-hidden mb-10"
            style={{
              aspectRatio: "16/9",
              maxHeight: "420px",
              boxShadow: "0 6px 40px rgba(0,0,0,0.09)",
              border: `1px solid rgba(44,44,46,0.06)`,
            }}
          >
            <Image
              src="/process-flow.png"
              alt="Nachricht → Qualifizierung → Termin → CRM"
              fill
              className="object-cover object-top"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>

          {/* Feature cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "🤖",
                title:
                  "KI-Agents die Leads finden, qualifizieren und kontaktieren",
              },
              {
                icon: "🎙️",
                title:
                  "Voice Agent der Outbound-Calls führt wie dein bester Closer",
              },
              {
                icon: "⚙️",
                title:
                  "CRM-Anbindung, Follow-Ups, Pipeline — alles automatisiert",
              },
              {
                icon: "🇩🇪",
                title: "DSGVO-konform. DACH-optimiert. Auf Deutsch.",
              },
            ].map((item, i) => (
              <div
                key={i}
                data-fade
                className="flex flex-col gap-4 p-6 rounded-[12px] cursor-default"
                style={{
                  border: `1px solid rgba(44,44,46,0.08)`,
                  backgroundColor: C.whiteout,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={cardHoverOn}
                onMouseLeave={(e) => cardHoverOff(e, "none")}
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
          Ergebnisse / Social Proof
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: C.floatie }}
        className="py-24 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2
            data-fade
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-14"
            style={{ color: C.caviar }}
          >
            Ergebnisse die zählen.
          </h2>

          {/* Stats — dark cards so Mindaro reads properly */}
          <div className="grid sm:grid-cols-3 gap-5 mb-16">
            {[
              { number: "+40%", label: "Conversion Rate" },
              { number: "24/7", label: "Lead-Bearbeitung" },
              { number: "90%", label: "Zeitersparnis" },
            ].map((stat, i) => (
              <div
                key={i}
                data-fade
                className="flex flex-col items-center justify-center gap-2 py-10 px-6 rounded-[12px]"
                style={{ backgroundColor: C.caviar }}
              >
                <div
                  className="text-5xl sm:text-6xl font-bold tracking-tight"
                  style={{ color: C.mindaro }}
                >
                  {stat.number}
                </div>
                <div
                  className="text-sm font-medium"
                  style={{ color: C.dirtySnow }}
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
                data-fade
                className="flex flex-col gap-4 p-8 rounded-[12px] cursor-default"
                style={{
                  backgroundColor: C.whiteout,
                  borderLeft: `3px solid ${C.mindaro}`,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={cardHoverOn}
                onMouseLeave={(e) => cardHoverOff(e)}
              >
                <span
                  className="text-5xl leading-none font-bold"
                  style={{ color: C.mindaro, fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </span>
                <p
                  className="text-base leading-relaxed flex-1"
                  style={{ color: C.caviar }}
                >
                  {quote}
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
          Für wen ist das?
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{ backgroundColor: C.whiteout }}
        className="py-24 sm:py-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div data-fade>
              <h2
                className="text-3xl sm:text-4xl font-semibold tracking-tight mb-10"
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
              <p className="text-sm leading-relaxed" style={{ color: C.dirtySnow }}>
                Kein Fit? Kein Problem. Unser scout CRM ist kostenlos für bis
                zu 500 Kontakte.
              </p>
            </div>

            {/* four-systems.png */}
            <div
              data-fade
              className="relative w-full rounded-[12px] overflow-hidden"
              style={{
                aspectRatio: "16/9",
                boxShadow: "0 6px 40px rgba(0,0,0,0.09)",
                border: `1px solid rgba(44,44,46,0.06)`,
              }}
            >
              <Image
                src="/four-systems.png"
                alt="Das close one. System"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          CTA + Cal.com
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        ref={calSectionRef}
        id="termin"
        style={{ backgroundColor: C.caviar }}
        className="py-28 sm:py-36"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div data-fade className="max-w-2xl mx-auto text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-semibold tracking-tight mb-5"
              style={{ color: C.whiteout }}
            >
              Lass uns in 30 Minuten herausfinden, ob wir dein Vertriebssystem
              bauen können.
            </h2>
            <p className="text-lg leading-relaxed" style={{ color: C.dirtySnow }}>
              Kostenlos. Unverbindlich. Kein Pitch — sondern eine ehrliche
              Analyse deiner Situation.
            </p>
          </div>
          <div ref={calEmbedRef} className="w-full" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Gründer
      ═══════════════════════════════════════════════════════════════════ */}
      <section
        style={{
          backgroundColor: C.caviar,
          borderTop: `1px solid rgba(251,251,251,0.07)`,
        }}
        className="py-20"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div
            data-fade
            className="flex flex-col sm:flex-row items-center sm:items-start gap-8 max-w-3xl mx-auto"
          >
            {/* Circular portrait */}
            <div
              className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden flex-shrink-0"
              style={{
                boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
                border: `2px solid rgba(220,243,101,0.3)`,
              }}
            >
              <Image
                src="/hero-dragan.png"
                alt="Dragan Matijević"
                fill
                className="object-cover object-top"
                sizes="112px"
              />
            </div>

            {/* Bio */}
            <div className="flex flex-col gap-3 text-center sm:text-left">
              <div>
                <p
                  className="font-semibold text-lg"
                  style={{ color: C.whiteout }}
                >
                  Dragan Matijević
                </p>
                <p className="text-sm" style={{ color: C.dirtySnow }}>
                  Gründer &amp; CEO — 30+ Jahre B2B-Vertrieb
                </p>
              </div>
              <p
                className="text-base leading-relaxed"
                style={{ color: C.dirtySnow }}
              >
                &ldquo;Ich weiß, dass ein schlagkräftiger Vertrieb der
                Überlebensgarant für jedes Unternehmen ist. Deshalb baue ich
                AI-Systeme, die Sales-Teams besser, schneller und unabhängiger
                machen.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          Footer
      ═══════════════════════════════════════════════════════════════════ */}
      <footer
        style={{
          backgroundColor: C.caviar,
          borderTop: "1px solid rgba(251,251,251,0.08)",
        }}
        className="py-8"
      >
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-sm" style={{ color: C.dirtySnow }}>
            © 2026 close one.&nbsp; | &nbsp;info@close-one.de&nbsp; |{" "}
            <a
              href="https://close-one.de/impressum"
              style={{ color: C.dirtySnow }}
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Impressum
            </a>{" "}
            |{" "}
            <a
              href="https://close-one.de/datenschutz"
              style={{ color: C.dirtySnow }}
              className="underline underline-offset-2 hover:opacity-80 transition-opacity"
            >
              Datenschutz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
