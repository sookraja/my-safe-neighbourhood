'use client';

import React, { useState } from 'react';
import { Upload, MapPin } from 'lucide-react';
import Navigation from './Navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { addIncident } from '@/firebase/incidents';
import { useRouter } from 'next/navigation';

const RealMapComponent = dynamic(() => import('./RealMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

const ReportIncident: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    type: 'Robbery',
    location: '',
    description: '',
    lat: 40.7128,
    lng: -74.0060
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const router = useRouter();

  const incidentTypes = [
    'Robbery',
    'Vandalism', 
    'Suspicious Activity',
    'Noise Complaint',
    'Break-in',
    'Drug Activity',
    'Violence',
    'Theft',
    'Harassment',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title || !form.location || !form.description) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user) {
      setError('You must be logged in to report an incident');
      return;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const dateTime = now.toISOString().slice(0, 19).replace('T', ' ');

      await addIncident({
        title: form.title,
        type: form.type,
        address: form.location,
        description: form.description,
        lat: form.lat,
        lng: form.lng,
        reportedBy: user.email || 'Anonymous',
        dateTime: dateTime,
        userId: user.uid,
      });

      alert('Incident reported successfully! Thank you for helping keep our neighborhood safe.');
      
      // Resets the form
      setForm({
        title: '',
        type: 'Robbery',
        location: '',
        description: '',
        lat: 40.7128,
        lng: -74.0060
      });

      // Redirect to dashboard after you have submitted your incident
      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting incident:', err);
      setError('Failed to submit incident. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = () => {
    alert('Photo upload functionality will be implemented later');
  };

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
        
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Title 
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                  style={{ color: '#000000' }}
                  placeholder="Brief description of what happened"
                  value={form.title}
                  onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Type
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  style={{ color: '#000000' }}
                  value={form.type}
                  onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                  disabled={isSubmitting}
                >
                  {incidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. 123 Main St. or click on the map"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
                    style={{ color: '#000000' }}
                    value={form.location}
                    onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Search on the map or enter the address manually
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description 
                </label>
                <textarea
                  placeholder="Describe the incident in detail. Include time, people involved, and any other relevant information."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-black placeholder-gray-400"
                  style={{ color: '#000000' }}
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters. Be specific but avoid personal information.
                </p>
              </div>
            
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={isSubmitting}
                  className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                    onClick={() => router.push('/dashboard')}
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
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="anonymous"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="anonymous" className="text-sm text-gray-700">
                    Submit anonymously
                  </label>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="checkbox"
                    id="updates"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    defaultChecked
                    disabled={isSubmitting}
                  />
                  <label htmlFor="updates" className="text-sm text-gray-700">
                    Receive updates about this incident
                  </label>
                </div>
              </div>
              
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

          {/* Map  */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Select Location</h3>
              <div className="mb-3">
                <p className="text-sm text-gray-600">
                  Search for an address or click anywhere on the map to select the incident location.
                </p>
              </div>
              <RealMapComponent
                incidents={[]}
                height="400px"
                showSearch={true}
                onLocationSelect={handleLocationSelect}
                center={[40.7128, -74.0060]}
                zoom={13}
              />
              <p className="text-xs text-gray-500 mt-2">
                The selected location will automatically fill in the location field above.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Recent Incidents Nearby</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 border-red-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-red-600">Vandalism</span>
                      <p className="text-xs text-gray-500 mt-1">789 Pine St</p>
                    </div>
                    <span className="text-xs text-gray-400">2 days ago</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 border-orange-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-orange-600">Noise Complaint</span>
                      <p className="text-xs text-gray-500 mt-1">321 Elm Dr</p>
                    </div>
                    <span className="text-xs text-gray-400">1 week ago</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border-l-4 border-yellow-400">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-yellow-600">Suspicious Activity</span>
                      <p className="text-xs text-gray-500 mt-1">123 Main St</p>
                    </div>
                    <span className="text-xs text-gray-400">2 weeks ago</span>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  These incidents help provide context for patterns in your neighborhood.
                </p>
              </div>
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