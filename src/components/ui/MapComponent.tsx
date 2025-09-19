import React from 'react';

interface Incident {
  id: number;
  title: string;
  type: string;
  address: string;
  dateTime: string;
  reportedBy: string;
  description: string;
  lat: number;
  lng: number;
}

interface MapComponentProps {
  incidents?: Incident[];
  selectedIncident?: Incident | null;
  onIncidentSelect?: (incident: Incident) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ incidents = [], selectedIncident = null, onIncidentSelect }) => {
  return (
    <div className="relative w-full h-full bg-gray-200 rounded-lg overflow-hidden">
      {/* Street grid pattern */}
      <div className="absolute inset-0">
        <svg width="100%" height="100%" className="opacity-20">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#666" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Street names */}
      <div className="absolute top-4 left-4 text-xs text-gray-600 font-medium">East 3rd St</div>
      <div className="absolute top-12 right-8 text-xs text-gray-600 font-medium transform rotate-90">Oak Ave</div>
      <div className="absolute bottom-16 left-6 text-xs text-gray-600 font-medium">East 2nd St</div>
      <div className="absolute bottom-4 right-12 text-xs text-gray-600 font-medium transform rotate-90">Pine St</div>
      
      {/* Park area */}
      <div className="absolute top-12 right-4 w-16 h-12 bg-green-200 rounded opacity-60"></div>
      <div className="absolute top-14 right-5 text-xs text-green-700">Riverside Park</div>
      
      {/* Water feature */}
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-blue-200 rounded-tl-full opacity-60"></div>
      
      {/* Incident markers */}
      {incidents.map((incident, index) => (
        <div
          key={incident.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
            selectedIncident?.id === incident.id ? 'scale-125 z-20' : 'z-10 hover:scale-110'
          }`}
          style={{
            left: `${20 + (index * 25) % 60}%`,
            top: `${30 + (index * 20) % 40}%`
          }}
          title={incident.title}
          onClick={() => onIncidentSelect && onIncidentSelect(incident)}
        >
          <div className={`p-2 rounded-full shadow-lg ${
            selectedIncident?.id === incident.id ? 'bg-blue-500' : 'bg-red-500'
          } text-white`}>
            <div className="text-white font-bold text-sm">!</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MapComponent;