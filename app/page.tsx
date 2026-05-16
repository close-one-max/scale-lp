"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// ── Konstante ──────────────────────────────────────────────────────────────
const VIMEO_SRC =
  "https://player.vimeo.com/video/1192877515?badge=0&autopause=0&player_id=0&app_id=58479";

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

// ── Checkmark ─────────────────────────────────────────────────────────────
function Check() {
  return (
    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
      <path
        d="M1.5 4L3.83 6.5L8.5 1.5"
        stroke="#2C2C2E"
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
  const calEmbedRef = useRef<HTMLDivElement>(null);

  // iOS Safari: prevent horizontal drift
  useEffect(() => {
    const fn = () => {
      if (window.scrollX !== 0) window.scrollTo(0, window.scrollY);
    };
    window.addEventListener("touchmove", fn, { passive: false });
    return () => window.removeEventListener("touchmove", fn);
  }, []);

  // Scroll fade-in
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-fade]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
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
    s.src = "https://app.cal.com/embed/embed.js";
    s.async = true;
    document.body.appendChild(s);
    const c = calEmbedRef.current;
    if (c && c.children.length === 0) {
      const el = document.createElement("cal-inline");
      el.setAttribute("calLink", "close-one/30min");
      el.setAttribute(
        "config",
        JSON.stringify({ layout: "month_view", theme: "dark" })
      );
      el.style.width = "100%";
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
    <div style={{ fontFamily: "var(--font-montserrat), Montserrat, system-ui, sans-serif" }}>

      {/* ═══════════════════════════════════════════════════════════════
          Hero — dunkler Hintergrund (wie Scout)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#2C2C2E] min-h-screen flex flex-col">

        {/* Nav */}
        <nav className="lp-wrap flex items-center py-6">
          <div className="flex items-center gap-2.5">
            <span
              className="flex items-center justify-center w-8 h-8 rounded-[8px] text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: "#DCF365", color: "#2C2C2E" }}
            >
              1
            </span>
            <span className="text-lg font-semibold tracking-tight text-[#FBFBFB]">
              close one.
            </span>
          </div>
        </nav>

        {/* Hero body */}
        <div className="flex-1 flex items-center">
          <div className="lp-wrap py-12 sm:py-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

              {/* Links */}
              <div className="flex flex-col gap-6 md:gap-8">

                {/* Badge mit Pulse-Dot */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full self-start"
                     style={{ backgroundColor: "#DCF365" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2C2C2E] animate-pulse flex-shrink-0" />
                  <span className="text-[#2C2C2E] text-xs font-bold tracking-[0.15em] uppercase">
                    KI-Vertriebssystem für B2B
                  </span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-[#FBFBFB]">
                  Vertrieb der skaliert —{" "}
                  <span
                    className="px-2 py-0.5 rounded-sm"
                    style={{ backgroundColor: "#DCF365", color: "#2C2C2E" }}
                  >
                    ohne neues Personal.
                  </span>
                </h1>

                {/* Subheadline */}
                <p className="text-[#FBFBFB]/70 text-lg font-medium leading-relaxed max-w-xl">
                  Wir bauen und betreiben dein komplettes KI-Vertriebssystem.
                  Du bekommst qualifizierte Termine — wir kümmern uns um den
                  Rest.
                </p>

                {/* CTA */}
                <div>
                  <button
                    onClick={scrollToCal}
                    className="px-10 py-4 rounded-full text-[#2C2C2E] font-bold text-lg cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: "#DCF365",
                      boxShadow: "0 8px 32px rgba(220,243,101,0.35)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#c9e04a";
                      e.currentTarget.style.boxShadow =
                        "0 12px 40px rgba(220,243,101,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#DCF365";
                      e.currentTarget.style.boxShadow =
                        "0 8px 32px rgba(220,243,101,0.35)";
                    }}
                  >
                    Kostenlose Erstanalyse sichern →
                  </button>
                </div>

                {/* Trust-Badges */}
                <div className="flex flex-wrap gap-2">
                  {[
                    "Kostenlos & unverbindlich",
                    "Kein Pitch",
                    "DSGVO-konform",
                    "DACH-optimiert",
                  ].map((badge) => (
                    <span
                      key={badge}
                      className="flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(220,243,101,0.12)",
                        color: "#DCF365",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: "#DCF365" }}
                      />
                      {badge}
                    </span>
                  ))}
                </div>

                <p className="text-[#FBFBFB]/30 text-sm">
                  Für IT-Dienstleister, Beratungen, SaaS und Industrie im
                  DACH-Raum
                </p>
              </div>

              {/* Rechts: Vimeo in Glas-Karte */}
              <div
                className="rounded-3xl p-3 shadow-2xl"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="relative w-full rounded-2xl overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
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
        </div>
      </section>

      {/* ── Mindaro-Divider ─────────────────────────────────────────────── */}
      <div className="h-1 bg-[#DCF365]" />

      {/* ═══════════════════════════════════════════════════════════════
          Trust Bar
      ═══════════════════════════════════════════════════════════════ */}
      <div data-fade className="bg-[#EAE8EC] py-6 border-b border-[#2C2C2E]/6">
        <div className="lp-wrap">
          <div className="flex flex-wrap justify-center items-center gap-y-3 gap-x-10 sm:gap-x-16">
            {[
              { value: "+40%", label: "Conversion Rate" },
              { value: "24/7", label: "Lead-Bearbeitung" },
              { value: "90%", label: "Zeitersparnis" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="text-lg font-bold text-[#2C2C2E]">
                  {stat.value}
                </span>
                <span className="text-sm font-medium text-[#2C2C2E]/50">
                  {stat.label}
                </span>
                {i < 2 && (
                  <span className="hidden sm:block w-px h-4 ml-4 bg-[#2C2C2E]/15" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Pain Points
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 border-t border-black/5">
        <div className="lp-wrap">

          <div data-fade className="text-center mb-14">
            <p className="text-[#2C2C2E]/40 text-xs font-semibold uppercase tracking-widest mb-4">
              Der Vertriebsalltag heute
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2C2C2E] mb-5">
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
                className="rounded-xl p-6 cursor-default transition-all duration-200"
                style={{
                  borderLeft: "4px solid #2C2C2E",
                  border: "1px solid #EAE8EC",
                  borderLeftWidth: "4px",
                  borderLeftColor: "#2C2C2E",
                  backgroundColor: "#EAE8EC",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <p className="text-[#2C2C2E] font-semibold text-sm leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Lösung — Feature-Karten mit Mindaro-Strich
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#FBFBFB] py-24 border-t border-black/5">
        <div className="lp-wrap">

          <div data-fade className="text-center mb-14">
            <p className="text-[#2C2C2E]/40 text-xs font-semibold uppercase tracking-widest mb-4">
              Die Lösung
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2C2C2E] mb-5">
              Andere verkaufen dir ein Tool{" "}
              <span
                className="px-1.5 py-0.5 rounded-sm"
                style={{ backgroundColor: "#EAE8EC" }}
              >
                und wünschen dir viel Glück.
              </span>
            </h2>
            <p className="text-lg text-[#2C2C2E] max-w-3xl mx-auto leading-relaxed font-medium">
              Wir liefern dir ein komplettes Vertriebssystem — aufgebaut,
              betrieben, optimiert.
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
                className="flex items-stretch gap-4 bg-white rounded-xl p-6 cursor-default transition-all duration-200"
                style={{
                  border: "1px solid #EAE8EC",
                  borderLeftWidth: "4px",
                  borderLeftColor: "#DCF365",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.09)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                }}
              >
                <p className="text-[#2C2C2E] font-semibold text-sm leading-relaxed">
                  {title}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Mindaro-Divider ─────────────────────────────────────────────── */}
      <div className="h-1 bg-[#DCF365]" />

      {/* ═══════════════════════════════════════════════════════════════
          Ergebnisse — dunkel, Mindaro-Zahlen
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#2C2C2E] py-24">
        <div className="lp-wrap">

          <h2
            data-fade
            className="text-4xl lg:text-5xl font-bold text-[#FBFBFB] text-center mb-16"
          >
            Ergebnisse die zählen.
          </h2>

          {/* Zahlen */}
          <div className="grid sm:grid-cols-3 gap-8 mb-20">
            {[
              { number: "+40%", label: "Conversion Rate" },
              { number: "24/7", label: "Lead-Bearbeitung" },
              { number: "90%", label: "Zeitersparnis" },
            ].map((stat, i) => (
              <div key={i} data-fade className="flex flex-col gap-1.5">
                <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-[#DCF365]">
                  {stat.number}
                </div>
                <div className="text-xs font-semibold uppercase tracking-widest text-[#FBFBFB]/40">
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
                className="flex flex-col gap-4 rounded-xl p-8 cursor-default transition-all duration-200"
                style={{
                  backgroundColor: "rgba(251,251,251,0.05)",
                  border: "1px solid rgba(251,251,251,0.08)",
                  borderLeftWidth: "4px",
                  borderLeftColor: "#DCF365",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.backgroundColor = "rgba(251,251,251,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.backgroundColor = "rgba(251,251,251,0.05)";
                }}
              >
                <span
                  className="text-4xl leading-none font-bold"
                  style={{ color: "#DCF365", fontFamily: "Georgia, serif" }}
                >
                  &ldquo;
                </span>
                <p className="text-[#FBFBFB] text-base leading-relaxed flex-1 font-medium">
                  {quote}
                </p>
                <p className="text-[#CBCDD5] text-xs font-semibold uppercase tracking-widest">
                  B2B-Dienstleister, DACH
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Mindaro-Divider ─────────────────────────────────────────────── */}
      <div className="h-1 bg-[#DCF365]" />

      {/* ═══════════════════════════════════════════════════════════════
          Für wen
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24 border-b border-black/5">
        <div className="lp-wrap">
          <div data-fade className="max-w-2xl">
            <p className="text-[#2C2C2E]/40 text-xs font-semibold uppercase tracking-widest mb-5">
              Passt das zu dir?
            </p>
            <h2 className="text-4xl lg:text-5xl font-bold text-[#2C2C2E] mb-10">
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
                    style={{ backgroundColor: "#DCF365" }}
                  >
                    <Check />
                  </span>
                  <span className="text-base font-semibold text-[#2C2C2E] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-[#CBCDD5] font-medium">
              Kein Fit? Kein Problem. Unser scout CRM ist kostenlos für bis zu
              500 Kontakte.
            </p>
          </div>
        </div>
      </section>

      {/* ── Mindaro-Divider ─────────────────────────────────────────────── */}
      <div className="h-1 bg-[#DCF365]" />

      {/* ═══════════════════════════════════════════════════════════════
          CTA + Cal.com
      ═══════════════════════════════════════════════════════════════ */}
      <section
        ref={calSectionRef}
        id="termin"
        className="bg-[#2C2C2E] py-[120px]"
      >
        <div className="lp-wrap">
          <div data-fade className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#DCF365] text-xs font-semibold uppercase tracking-widest mb-5">
              Jetzt Termin buchen
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FBFBFB] tracking-tight mb-5">
              Lass uns in 30 Minuten herausfinden, ob wir dein Vertriebssystem
              bauen können.
            </h2>
            <p className="text-lg text-[#FBFBFB]/50 font-medium leading-relaxed">
              Kostenlos. Unverbindlich. Kein Pitch — sondern eine ehrliche
              Analyse deiner Situation.
            </p>
          </div>
          <div ref={calEmbedRef} className="w-full" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Gründer — hell, zentriert
      ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#EAE8EC] py-20 border-t border-[#2C2C2E]/8">
        <div className="lp-wrap">
          <div
            data-fade
            className="flex flex-col sm:flex-row items-center sm:items-start gap-8 max-w-3xl mx-auto"
          >
            {/* Portrait 120×120 */}
            <div
              className="relative flex-shrink-0"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
                border: "3px solid #FBFBFB",
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

            <div className="flex flex-col gap-3 text-center sm:text-left">
              <span
                className="inline-block self-center sm:self-start rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  border: "1px solid rgba(44,44,46,0.2)",
                  color: "rgba(44,44,46,0.5)",
                }}
              >
                Founder · Sales · AI
              </span>
              <div>
                <p className="font-bold text-xl text-[#2C2C2E]">
                  Dragan Matijević
                </p>
                <p className="text-sm font-medium text-[#CBCDD5]">
                  Gründer &amp; CEO — 30+ Jahre B2B-Vertrieb
                </p>
              </div>
              <p className="text-base leading-relaxed text-[#2C2C2E]/70 font-medium">
                &ldquo;Ich weiß, dass ein schlagkräftiger Vertrieb der
                Überlebensgarant für jedes Unternehmen ist. Deshalb baue ich
                AI-Systeme, die Sales-Teams besser, schneller und unabhängiger
                machen.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Footer
      ═══════════════════════════════════════════════════════════════ */}
      <footer className="bg-[#2C2C2E] py-8 border-t border-white/10">
        <div className="lp-wrap">
          <p className="text-center text-sm text-[#CBCDD5] font-medium">
            © 2026 close one.&nbsp; | &nbsp;info@close-one.de&nbsp; |{" "}
            <a
              href="https://close-one.de/impressum"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity text-[#CBCDD5]"
            >
              Impressum
            </a>{" "}
            |{" "}
            <a
              href="https://close-one.de/datenschutz"
              className="underline underline-offset-2 hover:opacity-80 transition-opacity text-[#CBCDD5]"
            >
              Datenschutz
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
