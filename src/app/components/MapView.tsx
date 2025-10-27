"use client";

import { useCallback, useMemo, useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader
} from "@react-google-maps/api";
import type { Property } from "../data/properties";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  backgroundColor: "#020617",
  styles: [
    { elementType: "geometry", stylers: [{ color: "#0f172a" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#0f172a" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#e2e8f0" }] },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#cbd5f5" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#1e293b" }]
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#475569" }]
    }
  ]
};

type MapViewProps = {
  properties: Property[];
  selectedPropertyId?: string;
  onSelectProperty: (property: Property) => void;
};

export function MapView({ properties, selectedPropertyId, onSelectProperty }: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded, loadError } = useJsApiLoader({
    id: "atlas-agent-google-map",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? ""
  });

  const defaultCenter = useMemo(
    () => ({ lat: 37.7897, lng: -122.42 }),
    []
  );

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds();
    properties.forEach((property) => bounds.extend({ lat: property.lat, lng: property.lng }));
    mapInstance.fitBounds(bounds, 100);
    setMap(mapInstance);
  }, [properties]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-rose-400/40 bg-rose-950/60 p-4 text-sm text-rose-200">
        Failed to load Google Maps. Please check your API key configuration.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm text-slate-300">
        Loading map experience...
      </div>
    );
  }

  const selectedProperty = properties.find((property) => property.id === selectedPropertyId);

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={defaultCenter}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptions}
    >
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={{ lat: property.lat, lng: property.lng }}
          onClick={() => onSelectProperty(property)}
          icon={{
            url: selectedPropertyId === property.id
              ? "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png"
              : "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless2_hdpi.png",
            scaledSize: new google.maps.Size(27, 43)
          }}
        />
      ))}

      {selectedProperty && (
        <InfoWindow
          position={{
            lat: selectedProperty.lat,
            lng: selectedProperty.lng
          }}
          onCloseClick={() => {
            map?.panTo({ lat: selectedProperty.lat, lng: selectedProperty.lng });
          }}
        >
          <div className="max-w-xs text-slate-900">
            <p className="font-semibold">{selectedProperty.title}</p>
            <p className="text-xs opacity-70">{selectedProperty.address}</p>
            <p className="mt-1 text-sm font-semibold text-brand-600">{selectedProperty.price}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapView;
