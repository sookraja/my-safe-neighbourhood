'use client';

import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Search } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { Incident } from '@/firebase/incidents';
import L from 'leaflet';
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealMapComponentProps {
  incidents?: Incident[];
  selectedIncident?: Incident | null;
  onIncidentSelect?: (incident: Incident) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showSearch?: boolean;
  onLocationSelect?: (address: string, lat: number, lng: number) => void;
  userLocation?: [number, number];
}

// Component to handle map updates
const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();

  React.useEffect(() => {
    map.setView(center, zoom, { animate: true }); // smooth pan to pin location
  }, [map, center, zoom]);

  return null;
};

// handle map clicks for location selection
const MapClickHandler: React.FC<{ onLocationSelect?: (lat: number, lng: number) => void }> = ({ onLocationSelect }) => {
  const map = useMap();

  React.useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      if (onLocationSelect) {
        onLocationSelect(e.latlng.lat, e.latlng.lng);
      }
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
  center = [40.7128, -74.0060],
  zoom = 13,
  height = "400px",
  showSearch = false,
  onLocationSelect,
  userLocation
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null);



  React.useEffect(() => {
    setMapCenter(center);
    setMapZoom(zoom);
  }, [center, zoom]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);

        setMapCenter([lat, lng]);
        setMapZoom(16);

        if (onLocationSelect) {
          onLocationSelect(result.display_name, lat, lng);
        }
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation([lat, lng]);

    // Reverse geocoding to get address
    if (onLocationSelect) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then(response => response.json())
        .then(data => {
          const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          onLocationSelect(address, lat, lng);
        })
        .catch(() => {
          onLocationSelect(`${lat.toFixed(6)}, ${lng.toFixed(6)}`, lat, lng);
        });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative">
      {showSearch && (
        <div className="absolute top-4 left-4 right-4 z-[1000]">
          <div className="bg-white rounded-lg shadow-lg p-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for an address or landmark..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                  style={{ color: '#000000' }}
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
        </div>
      )}

      <div style={{ height, width: '100%' }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          zoomControl={true}
          scrollWheelZoom={true}
          doubleClickZoom={true}
          touchZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />


          {/* User location marker */}
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">Your Location</h3>
                  <p className="text-xs text-gray-500">
                    {userLocation[0].toFixed(6)}, {userLocation[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}

          <MapUpdater center={mapCenter} zoom={mapZoom} />

          {onLocationSelect && (
            <MapClickHandler onLocationSelect={handleMapClick} />
          )}

          {/* Incident markers */}
          {incidents.map((incident) => (
            <Marker
              key={incident.id}
              position={[incident.lat, incident.lng]}
              eventHandlers={{
                click: () => {
                  if (onIncidentSelect) {
                    onIncidentSelect(incident);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">{incident.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{incident.type}</p>
                  <p className="text-xs text-gray-500">{incident.address}</p>
                  <p className="text-xs text-gray-500">{incident.dateTime}</p>

                  //displays image if available
                  {incident.imageUrl && (
                    <img
                      src={incident.imageUrl}
                      alt={incident.title}
                      className="mt-2 w-full h-auto rounded-md"
                    />
                  )}

                  {incident.upvotes !== undefined && (
                    <p className="text-xs text-green-600 mt-1">
                      ✓ {incident.upvotes} confirmed | ✗ {incident.downvotes} disputed
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {selectedLocation && (
            <Marker position={selectedLocation}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-sm">Selected Location</h3>
                  <p className="text-xs text-gray-500">
                    {selectedLocation[0].toFixed(6)}, {selectedLocation[1].toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default RealMapComponent;