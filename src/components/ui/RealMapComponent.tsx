~~~{"variant":"standard","title":"RealMapComponent Fixed UserLocation","id":"52746"}
'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Incident } from '@/firebase/incidents';
import CenterOnUserButton from './CenterOnUserButton';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealMapComponentProps {
  incidents?: Incident[];
  selectedIncident?: Incident | null;
  onIncidentSelect?: (incident: Incident) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showSearch?: boolean;
  showCenterButton?: boolean;
  onLocationSelect?: (address: string, lat: number, lng: number) => void;
  userLocation?: [number, number];
}

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.setView(center as L.LatLngExpression, zoom, { animate: true });
  }, [map, center, zoom]);

  return null;
};

const MapClickHandler: React.FC<{ onLocationSelect?: (lat: number, lng: number) => void }> = ({
  onLocationSelect,
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !onLocationSelect) return;

    const handleClick = (e: L.LeafletMouseEvent) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [map, onLocationSelect]);

  return null;
};

const RealMapComponent: React.FC<RealMapComponentProps> = ({
  incidents = [],
  selectedIncident = null,
  onIncidentSelect,
  center = [40.7128, -74.006],
  zoom = 13,
  height = '400px',
  showSearch = false,
  showCenterButton = true,
  onLocationSelect,
}) => {
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);

  // User location state with mock fallback
  const mockLocation: [number, number] = [40.7128, -74.0060];
  const [userLocation, setUserLocation] = useState<[number, number]>(mockLocation);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (err) => console.error(err)
    );
  }, []);

  // Sync props center/zoom with state
  useEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setMapCenter([lat, lng]);
        setMapZoom(16);
        onLocationSelect?.(data[0].display_name, lat, lng);
      } else {
        alert('Location not found. Try a different search term.');
      }
    } catch (err) {
      console.error(err);
      alert('Search failed. Try again.');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);
    if (onLocationSelect) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((res) => res.json())
        .then((data) => {
          onLocationSelect(data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
        })
        .catch(() => {
          onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
        });
    }
  };

  return (
    <div className="relative">
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="bg-white rounded-lg shadow-lg p-3 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for an address or landmark..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      )}

      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          zoomControl
          scrollWheelZoom
          doubleClickZoom
          touchZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* User location marker */}
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>

          {/* Map view updater */}
          <MapUpdater center={mapCenter} zoom={mapZoom} />

          {/* Map click handler */}
          {onLocationSelect && <MapClickHandler onLocationSelect={handleMapClick} />}

          {/* Incident markers */}
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              eventHandlers={{ click: () => onIncidentSelect?.(incident) }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{incident.title}</h3>
                  <p className="text-xs text-gray-600">{incident.type}</p>
                  <p className="text-xs text-gray-500">{incident.address}</p>
                  <p className="text-xs text-gray-500">{incident.dateTime}</p>
                  {incident.upvotes !== undefined && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {incident.upvotes} confirmed | ✗ {incident.downvotes} disputed
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Selected location marker */}
          {selectedLocation && <Marker position={selectedLocation} />}

          {/* CenterOnUserButton */}
          {showCenterButton && <CenterOnUserButton userLocation={userLocation} />}
        </MapContainer>
      </div>
    </div>
  );
};

export default RealMapComponent;
