"use client";

import clsx from "clsx";
import type { Property } from "../data/properties";

type PropertyListProps = {
  properties: Property[];
  selectedPropertyId?: string;
  onSelectProperty: (property: Property) => void;
};

const statusStyles: Record<Property["status"], string> = {
  available: "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/40",
  pending: "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40",
  sold: "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/40"
};

const statusLabel: Record<Property["status"], string> = {
  available: "Available",
  pending: "Pending",
  sold: "Sold"
};

export function PropertyList({ properties, selectedPropertyId, onSelectProperty }: PropertyListProps) {
  return (
    <div className="card h-full overflow-hidden">
      <header className="border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Active Listings</h2>
        <p className="text-sm text-slate-300/80">Tap a property to focus the map, then ask questions in the chat.</p>
      </header>
      <div className="divide-y divide-white/5 overflow-y-auto px-4">
        {properties.map((property) => (
          <button
            key={property.id}
            type="button"
            onClick={() => onSelectProperty(property)}
            className={clsx(
              "group flex w-full flex-col gap-2 rounded-xl px-3 py-4 text-left transition",
              selectedPropertyId === property.id
                ? "bg-white/10 ring-1 ring-brand-400/50"
                : "hover:bg-white/5"
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">{property.title}</h3>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${statusStyles[property.status]}`}>
                {statusLabel[property.status]}
              </span>
            </div>
            <p className="text-sm text-slate-300">{property.address}</p>
            <dl className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1 text-brand-200">
                <span className="font-semibold text-sm text-brand-100">{property.price}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-100">{property.beds}</span>
                <span>beds</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-100">{property.baths}</span>
                <span>baths</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-100">{property.area.toLocaleString()}</span>
                <span>sqft</span>
              </div>
            </dl>
            <ul className="mt-3 grid gap-2 text-xs text-slate-300">
              {property.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-slate-400">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-brand-300" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
    </div>
  );
}

export default PropertyList;
