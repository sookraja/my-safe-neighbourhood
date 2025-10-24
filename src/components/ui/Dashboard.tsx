'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, ThumbsUp, ThumbsDown, TrendingUp, TrendingDown } from 'lucide-react';
import Navigation from './Navigation';
import dynamic from 'next/dynamic';
import { getIncidents, Incident, upvoteIncident, downvoteIncident, hasUserVoted, getCredibilityScore, getCredibilityPercentage } from '@/firebase/incidents';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const RealMapComponent = dynamic(() => import('./RealMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

const distanceLimitForReports = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
 
  const latitudeDifference = lat2 - lat1;
  const longitudeDifference = lon2 - lon1;
  const distance = Math.sqrt(latitudeDifference * latitudeDifference + longitudeDifference* longitudeDifference) * 111;
  
  return distance;
};

const Dashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [votingIncidentId, setVotingIncidentId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.0060]);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'allowed' | 'denied'>('loading');

  useEffect(() => {
    loadIncidents();
  }, []);


  useEffect(() => {
    const requestLocation = () => {
      if (!navigator.geolocation) {
        setLocationStatus('denied');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('allowed');
        },
        (error) => {
          console.log('Location denied or error:', error);
          setLocationStatus('denied');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    requestLocation();
  }, []);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await getIncidents();
      setIncidents(data);
      setError('');
    } catch (err) {
      console.error('Error loading incidents:', err);
      setError('Failed to load incidents. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (incidentId: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    
    if (!user) {
      alert('Please login to vote on incidents');
      return;
    }

    setVotingIncidentId(incidentId);
    try {
      await upvoteIncident(incidentId, user.uid);
      await loadIncidents(); 
      
      if (selectedIncident?.id === incidentId) {
        const updatedIncident = incidents.find(i => i.id === incidentId);
        if (updatedIncident) setSelectedIncident(updatedIncident);
      }
    } catch (err: unknown) {
  if (err instanceof Error) {
    alert(err.message);
  } else {
    alert('Failed to upvote incident');
  }
} finally {
  setVotingIncidentId(null);
}
  };

  const handleDownvote = async (incidentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to vote on incidents');
      return;
    }

    setVotingIncidentId(incidentId);
    try {
      await downvoteIncident(incidentId, user.uid);
      await loadIncidents();
      
      if (selectedIncident?.id === incidentId) {
        const updatedIncident = incidents.find(i => i.id === incidentId);
        if (updatedIncident) setSelectedIncident(updatedIncident);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('Failed to downvote incident');
      }
    } finally {
      setVotingIncidentId(null);
    }
  };

  const getCredibilityColor = (score: number) => {
    if (score >= 5) return 'text-green-600';
    if (score >= 0) return 'text-gray-600';
    return 'text-red-600';
  };

  const getCredibilityBadge = (incident: Incident) => {
    const score = getCredibilityScore(incident);
    const percentage = getCredibilityPercentage(incident);
    
    if (score >= 5) return { text: 'Verified', color: 'bg-green-100 text-green-800' };
    if (score >= 2) return { text: 'Credible', color: 'bg-blue-100 text-blue-800' };
    if (score >= 0) return { text: 'Unverified', color: 'bg-gray-100 text-gray-800' };
    if (score >= -2) return { text: 'Disputed', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Questionable', color: 'bg-red-100 text-red-800' };
  };

  const filteredIncidents = incidents.filter(incident => {
  const matchesSearch = 
    incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
  
  if (locationStatus === 'allowed') {
    const distance = distanceLimitForReports(
      userLocation[0],
      userLocation[1],
      incident.lat,
      incident.lng  
    );
    return matchesSearch && distance <= 25; //this is will limit searches in a 25km radius
  }
  return matchesSearch;
});

  const handleReportIncident = () => {
    router.push('/report');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading incidents...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
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
              
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ? 'No incidents found matching your search.' : 'No incidents reported yet.'}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={handleReportIncident}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Be the first to report!
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredIncidents.map((incident) => {
                    const score = getCredibilityScore(incident);
                    const badge = getCredibilityBadge(incident);
                    const userHasVoted = user ? hasUserVoted(incident, user.uid) : false;
                    
                    return (
                      <div
                        key={incident.id}
                        className={`border border-gray-200 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedIncident?.id === incident.id ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-gray-900">
                                {incident.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${badge.color}`}>
                                {badge.text}
                              </span>
                            </div>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              incident.type === 'Violence' || incident.type === 'Robbery' ? 'bg-red-100 text-red-800' :
                              incident.type === 'Theft' || incident.type === 'Break-in' ? 'bg-orange-100 text-orange-800' :
                              incident.type === 'Vandalism' ? 'bg-yellow-100 text-yellow-800' :
                              incident.type === 'Suspicious Activity' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {incident.type}
                            </span>
                          </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Date/Time:</span> {incident.dateTime || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Reported By:</span> {incident.reportedBy || 'Anonymous'}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">Address:</span> {incident.address || 'Location not specified'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => handleUpvote(incident.id!, e)}
                              disabled={userHasVoted || votingIncidentId === incident.id}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                                userHasVoted 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-green-50 text-green-700 hover:bg-green-100'
                              }`}
                              title={userHasVoted ? "You've already voted" : "Confirm this incident occurred"}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="font-medium">{incident.upvotes || 0}</span>
                            </button>
                            
                            <button
                              onClick={(e) => handleDownvote(incident.id!, e)}
                              disabled={userHasVoted || votingIncidentId === incident.id}
                              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                                userHasVoted 
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                  : 'bg-red-50 text-red-700 hover:bg-red-100'
                              }`}
                              title={userHasVoted ? "You've already voted" : "Report this as false"}
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span className="font-medium">{incident.downvotes || 0}</span>
                            </button>
                          </div>
                          
                          <div className={`flex items-center gap-1 ${getCredibilityColor(score)}`}>
                            {score > 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : score < 0 ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : null}
                            <span className="font-semibold">{score > 0 ? '+' : ''}{score}</span>
                            <span className="text-xs text-gray-500">score</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
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
              {searchTerm && (
                <p className="text-xs text-gray-500 mt-2">
                  Found {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Incident Locations</h3>
              <RealMapComponent 
                incidents={filteredIncidents} 
                selectedIncident={selectedIncident}
                onIncidentSelect={setSelectedIncident}
                height="300px"
                center={userLocation}  
                zoom={locationStatus === 'allowed' ? 15 : 12} 
              />
              <p className="text-xs text-gray-500 mt-2">
                Click on markers to view details
              </p>
            </div>

            {selectedIncident ? (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-bold text-lg mb-3 text-gray-900">Incident Details</h3>
                
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Community Verification</span>
                    <span className={`text-lg font-bold ${getCredibilityColor(getCredibilityScore(selectedIncident))}`}>
                      {getCredibilityScore(selectedIncident) > 0 ? '+' : ''}{getCredibilityScore(selectedIncident)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full ${
                        getCredibilityScore(selectedIncident) >= 5 ? 'bg-green-500' :
                        getCredibilityScore(selectedIncident) >= 0 ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ 
                        width: `${Math.min(Math.abs(getCredibilityScore(selectedIncident)) * 10, 100)}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{selectedIncident.upvotes || 0} confirmed</span>
                    <span>{selectedIncident.downvotes || 0} disputed</span>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                    selectedIncident.type === 'Violence' || selectedIncident.type === 'Robbery' ? 'bg-red-100 text-red-800' :
                    selectedIncident.type === 'Theft' || selectedIncident.type === 'Break-in' ? 'bg-orange-100 text-orange-800' :
                    selectedIncident.type === 'Vandalism' ? 'bg-yellow-100 text-yellow-800' :
                    selectedIncident.type === 'Suspicious Activity' ? 'bg-purple-100 text-purple-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedIncident.type}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div>
                    <strong className="text-gray-900">Title:</strong> {selectedIncident.title}
                  </div>
                  <div>
                    <strong className="text-gray-900">Location:</strong> {selectedIncident.address || 'Not specified'}
                  </div>
                  <div>
                    <strong className="text-gray-900">Time:</strong> {selectedIncident.dateTime || 'Not specified'}
                  </div>
                  <div>
                    <strong className="text-gray-900">Reported by:</strong> {selectedIncident.reportedBy || 'Anonymous'}
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <strong className="text-gray-900 text-sm block mb-2">Description:</strong>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedIncident.description || 'No description provided.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-center py-8 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm">Select an incident to view details</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Incidents:</span>
                  <span className="font-semibold text-gray-900">{incidents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Verified:</span>
                  <span className="font-semibold text-green-600">
                    {incidents.filter(i => getCredibilityScore(i) >= 5).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Disputed:</span>
                  <span className="font-semibold text-red-600">
                    {incidents.filter(i => getCredibilityScore(i) < 0).length}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={loadIncidents}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              🔄 Refresh Incidents
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;