'use client';

import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import Navigation from './Navigation';
import dynamic from 'next/dynamic';

const RealMapComponent = dynamic(() => import('./RealMapComponent'), {
  ssr: false,
  loading: () => <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center"></div>
});

// Random Mock data 
const mockIncidents = [
  {
    id: 1,
    title: "Suspicious Activity Near Park",
    type: "Suspicious Activity",
    address: "123 Main St",
    dateTime: "2025-09-15 14:30",
    reportedBy: "John Doe",
    description: "Saw someone loitering around the playground area for an extended period. The individual was acting nervously and seemed to be watching children playing. When approached by other parents, they quickly left the area. This behavior continued for about 30 minutes before they departed.",
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: 2,
    title: "Break-in Attempt",
    type: "Break-in",
    address: "456 Oak Ave",
    dateTime: "2025-09-14 22:15",
    reportedBy: "Jane Smith",
    description: "Noticed someone trying to break into a car parked on the street. They were using what appeared to be a coat hanger to try to unlock the door. When they saw me watching from my window, they ran away. The car owner has been notified.",
    lat: 40.7589,
    lng: -73.9851
  },
  {
    id: 3,
    title: "Vandalism in Alley",
    type: "Vandalism",
    address: "789 Pine St",
    dateTime: "2025-09-13 16:45",
    reportedBy: "Mike Johnson",
    description: "Large graffiti found on the side of the apartment building facing the alley. The graffiti appears to contain gang symbols and profanity. Property manager has been contacted. This is the third incident of vandalism in this area this month.",
    lat: 40.7282,
    lng: -74.0776
  },
  {
    id: 4,
    title: "Noise Complaint",
    type: "Noise",
    address: "321 Elm Dr",
    dateTime: "2024-09-12 23:00",
    reportedBy: "Sarah Wilson",
    description: "Extremely loud music and shouting coming from apartment 4B. The noise started around 11 PM and continued past midnight. Multiple neighbors have complained. This is becoming a recurring issue on weekends.",
    lat: 40.7505,
    lng: -73.9934
  },
  {
    id: 5,
    title: "Drug Activity Suspected",
    type: "Drug Activity",
    address: "654 Maple Ave",
    dateTime: "2025-09-11 19:20",
    reportedBy: "Anonymous",
    description: "Unusual amount of foot traffic at this address with very brief visits. Visitors appear to be exchanging items with the resident. Activity increases during evening hours.",
    lat: 40.7390,
    lng: -74.0020
  },
  {
    id: 6,
    title: "Bicycle Theft",
    type: "Theft",
    address: "987 Cedar St",
    dateTime: "2025-09-10 08:15",
    reportedBy: "Tom Anderson",
    description: "My bicycle was stolen from the bike rack outside the coffee shop. It was secured with a chain lock that was cut. Security cameras may have captured the incident.",
    lat: 40.7456,
    lng: -73.9876
  }
];

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

const Dashboard: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = mockIncidents.filter(incident =>
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

 const handleReportIncident = () => {
  window.location.href = '/report';
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Incidents List - Left Side */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">All Incidents</h2>
                <button
                  onClick={handleReportIncident}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Report Incident
                </button>
              </div>
              
              <div className="space-y-4">
                {filteredIncidents.map((incident) => (
                  <div
                    key={incident.id}
                    className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedIncident?.id === incident.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedIncident(incident)}
                  >
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      {incident.title}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Incident Type:</span> {incident.type}
                      </div>
                      <div>
                        <span className="font-medium">Date/Time:</span> {incident.dateTime}
                      </div>
                      <div>
                        <span className="font-medium">Address:</span> {incident.address}
                      </div>
                      <div>
                        <span className="font-medium">Reported By:</span> {incident.reportedBy}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/*Sidebar */}
          <div className="space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search incidents..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                  style={{ color: '#000000' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/*Map*/}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Incident Locations</h3>
              <div className="h-64">
               <RealMapComponent 
                  incidents={mockIncidents}
                  height="260px"
                  center={[40.7128, -74.0060]}
                  zoom={12}
                />
              </div>
            </div>

           {/*Incident Description*/}
            {selectedIncident && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Incident Description</h3>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                    {selectedIncident.type}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  <div><strong>Location:</strong> {selectedIncident.address}</div>
                  <div><strong>Time:</strong> {selectedIncident.dateTime}</div>
                  <div><strong>Reported by:</strong> {selectedIncident.reportedBy}</div>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {selectedIncident.description}
                </p>
              </div>
            )}

            {/*Stats*/}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Incidents:</span>
                  <span className="font-semibold text-gray-900">{mockIncidents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">This Week:</span>
                  <span className="font-semibold text-blue-600">4</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Resolved:</span>
                  <span className="font-semibold text-green-600">3</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active:</span>
                  <span className="font-semibold text-orange-600">3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;