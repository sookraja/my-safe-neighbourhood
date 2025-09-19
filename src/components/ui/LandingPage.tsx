'use client';

import React, { useState } from 'react';
import { User } from 'lucide-react';
import Navigation from './Navigation';
import MapComponent from './MapComponent';

// Mock data for incidents to be used later on if needed
const mockIncidents = [
  {
    id: 1,
    title: "Suspicious Activity Near Park",
    type: "Suspicious Activity",
    address: "123 Main St",
    dateTime: "2024-09-15 14:30",
    reportedBy: "John Doe",
    description: "Saw someone loitering around the playground area for an extended period",
    lat: 40.7128,
    lng: -74.0060
  },
  {
    id: 2,
    title: "Break-in Attempt",
    type: "Break-in",
    address: "456 Oak Ave",
    dateTime: "2024-09-14 22:15",
    reportedBy: "Jane Smith",
    description: "Noticed someone trying to break into a car parked on the street",
    lat: 40.7589,
    lng: -73.9851
  }
];

const LandingPage: React.FC = () => {
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => { e.preventDefault();
  if (loginForm.username && loginForm.password) {
    // Redirects to the incidents page / dashboard page after sign in
    window.location.href = '/dashboard';
  } else {
    alert('Please enter both username and password');
  }
};

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-200px)]">
          {/*Map Side*/}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6 h-[500px]">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Incident Map</h3>
                <p className="text-sm text-gray-600">Real-time neighborhood safety updates</p>
              </div>
              <div className="h-full">
                <MapComponent incidents={mockIncidents} />
              </div>
            </div>
            {/*cards */}
            <div className="absolute -right-4 -top-4 bg-white rounded-lg shadow-lg p-4 w-32">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-600">Reports Today</div>
              </div>
            </div>
            <div className="absolute -left-4 bottom-20 bg-white rounded-lg shadow-lg p-4 w-36">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-xs text-gray-600">Community Safe</div>
              </div>
            </div>
          </div>

          {/*Login Side*/}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Report Incidents,<br />
                <span className="text-blue-600">Stay Informed,</span><br />
                Protect your<br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Neighborhood!</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Join thousands of neighbors creating safer communities through real-time incident reporting and community awareness.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Welcome Back !</h2>
                <p className="text-gray-600 mt-2">Sign in to access your neighborhood dashboard</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black "
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                    🔒
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  Sign In
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">Don't have an account?</p>
                <button
                  onClick={() => window.location.href = '/signup'}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium border-2 border-gray-200 hover:border-gray-300"
                >
                  Create Account
                </button>
              </div>
              
              <div className="mt-6 text-center">
                <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="text-lg font-bold text-gray-800">1000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="text-lg font-bold text-gray-800">24/7</div>
                <div className="text-sm text-gray-600">Monitoring</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-lg backdrop-blur-sm">
                <div className="text-lg font-bold text-gray-800">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-6 text-gray-400 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-sm">f</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-sm">t</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-sm">ig</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-sm">yt</span>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-blue-600 text-sm">in</span>
            </div>
          </div>
          <div className="text-center text-gray-600 text-sm">
            © 2025 SafeNeighborhood. All rights reserved. | Privacy – Terms
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;