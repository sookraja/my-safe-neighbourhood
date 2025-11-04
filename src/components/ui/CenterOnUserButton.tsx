~~~{"variant":"standard","title":"CenterOnUserButton with Mock Fallback","id":"52745"}
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { Navigation } from 'lucide-react';

interface CenterOnUserButtonProps {
  userLocation: [number, number]; 
}

const CenterOnUserButton: React.FC<CenterOnUserButtonProps> = ({ userLocation }) => {
  const map = useMap();
  const [currentLocation, setCurrentLocation] = useState(userLocation);

  useEffect(() => {
    setCurrentLocation(userLocation);
  }, [userLocation]);

  const handleClick = () => {
    map.setView(currentLocation, map.getZoom(), { animate: true });
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-4 right-4 w-12 h-12 z-[1001] bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
      aria-label="Center map on user location"
    >
      <Navigation className="w-6 h-6 text-white" fill="currentColor" stroke="none" />
    </button>
  );
};

export default CenterOnUserButton;