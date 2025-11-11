'use client';

import React, { useState, useEffect } from 'react';
import { Upload, MapPin } from 'lucide-react';
import Navigation from './Navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { addIncident } from '@/firebase/incidents';
import { useRouter } from 'next/navigation';
import { getUser } from '@/firebase/users';

const RealMapComponent = dynamic(() => import('./RealMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

const mockLocation: [number, number] = [40.7128, -74.0060];

const ReportIncident: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    type: 'Robbery',
    location: '',
    description: '',
    lat: mockLocation[0],
    lng: mockLocation[1],
  });
  const [userLocation, setUserLocation] = useState<[number, number]>(mockLocation);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const incidentTypes = [
    'Robbery', 'Vandalism', 'Suspicious Activity', 'Noise Complaint',
    'Break-in', 'Drug Activity', 'Violence', 'Theft', 'Harassment', 'Other'
  ];

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Geolocation not supported, using mock location');
      setUserLocation(mockLocation);
      setForm(prev => ({ ...prev, lat: mockLocation[0], lng: mockLocation[1] }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location: [number, number] = [latitude, longitude];
        setUserLocation(location);
        setForm(prev => ({ ...prev, lat: latitude, lng: longitude }));
      },
      (error) => {
        console.warn('Geolocation failed, using mock location', error);
        setUserLocation(mockLocation);
        setForm(prev => ({ ...prev, lat: mockLocation[0], lng: mockLocation[1] }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.location || !form.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (form.description.length < 20) {
      setError('Description must be at least 20 characters long');
      return;
    }

    if (!user) {
      setError('You must be logged in to report an incident');
      return;
    }

    setIsSubmitting(true);
    try {
      const dateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

      await addIncident({
        title: form.title,
        type: form.type,
        address: form.location,
        description: form.description,
        lat: form.lat,
        lng: form.lng,
        reportedBy: user.uid, 
        dateTime,
        userId: user.uid,
      });

      alert('Incident reported successfully! Thank you for helping keep our neighborhood safe.');
      
      setForm({
        title: '',
        type: 'Robbery',
        location: '',
        description: '',
        lat: userLocation[0],
        lng: userLocation[1],
      });

      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting incident:', err);
      setError('Failed to submit incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = () => alert('Photo upload functionality will be implemented later');

  const handleLocationSelect = (address: string, lat: number, lng: number) => {
    setForm(prev => ({ ...prev, location: address, lat, lng }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Report An Incident</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Responsive layout: map below form on mobile, side-by-side on desktop */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 flex-1 order-1 lg:order-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Title *
                </label>
                <input
                  type="text"
                  placeholder="Brief description of what happened"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  {incidentTypes.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. 123 Main St. or click on the map"
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                    disabled={isSubmitting}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Search on the map or enter the address manually</p>
              </div>

              {/* Map for mobile view */}
              <div className="block lg:hidden">
                <div className="bg-white rounded-lg shadow-sm p-4 mt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Select Location</h3>
                  <RealMapComponent
                    incidents={[]}
                    height="400px"
                    showSearch={true}
                    onLocationSelect={handleLocationSelect}
                    center={userLocation}
                    zoom={13}
                    showCenterButton={true}
                    userLocation={userLocation}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    The selected location will automatically fill in the location field above.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the incident in detail. Include time, people involved, and any other relevant information."
                  rows={6}
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black placeholder-gray-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {form.description.length}/20 characters minimum
                </p>
              </div>

              {/* Upload / Submit */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isSubmitting}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" /> Upload Photo
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 bg-red-50 text-red-600 px-6 py-3 rounded-lg hover:bg-red-100 transition-colors font-medium"
                    onClick={() => router.push('/dashboard')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <div className="text-yellow-600 mr-3">⚠️</div>
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Safety First</p>
                    <p>
                      If this is an emergency, please call 911 immediately. 
                      This form is for non-emergency incident reporting only.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Map Section */}
          <div className="hidden lg:block flex-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Select Location</h3>
              <p className="text-sm text-gray-600 mb-3">
                Search for an address or click anywhere on the map to select the incident location.
              </p>

              <RealMapComponent
                incidents={[]}
                height="400px"
                showSearch={true}
                onLocationSelect={handleLocationSelect}
                center={userLocation}
                zoom={13}
                showCenterButton={true}
                userLocation={userLocation}
              />
              <p className="text-xs text-gray-500 mt-2">
                The selected location will automatically fill in the location field above.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Reporting Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Be as specific as possible with times and descriptions</li>
                <li>• Include relevant details but avoid personal information</li>
                <li>• Use the map to pinpoint exact locations</li>
                <li>• Consider submitting anonymously if you have concerns</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;