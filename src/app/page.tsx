"use client";

import { useMemo, useState } from "react";
import ChatPanel from "./components/ChatPanel";
import MapView from "./components/MapView";
import PropertyList from "./components/PropertyList";
import { properties } from "./data/properties";

export default function Home() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>(properties[0]?.id);

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId),
    [selectedPropertyId]
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col gap-6 px-6 pb-12 pt-10">
      <header className="flex flex-col gap-4 text-white">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-200">
          Atlas Agent
        </span>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Your AI navigator for San Francisco real estate intelligence
        </h1>
        <p className="max-w-3xl text-lg text-slate-200/90">
          Track properties live on Google Maps, surface hyper-local insights on demand, and orchestrate tours or negotiations with an instant GPT copilot trained on market velocity, transport, and zoning signals.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-300/80">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Live comp analysis</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Walkscore + commute models</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Instant buyer Q&amp;A</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Tour itinerary planning</span>
        </div>
      </header>

      <section className="grid flex-1 gap-6 lg:grid-cols-[380px_minmax(0,1fr)_minmax(0,420px)]">
        <PropertyList
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onSelectProperty={(property) => setSelectedPropertyId(property.id)}
        />
        <div className="card min-h-[420px] overflow-hidden">
          <MapView
            properties={properties}
            selectedPropertyId={selectedPropertyId}
            onSelectProperty={(property) => setSelectedPropertyId(property.id)}
          />
        </div>
        <ChatPanel selectedProperty={selectedProperty} />
      </section>

      <footer className="flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-400">
        <span>
          Tip: Drop in building permits, HOA docs, or financial models soon—Atlas Agent is ready to reason across structured + unstructured data streams.
        </span>
        <span>Powered by OpenAI GPT and real-time Google Maps intelligence.</span>
      </footer>
    </main>
  );
}
