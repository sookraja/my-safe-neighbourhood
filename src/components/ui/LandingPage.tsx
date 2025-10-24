'use client';

import React, { useState, useEffect } from 'react';
import { User, MapPin } from 'lucide-react';
import Navigation from './Navigation';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Incident } from '@/firebase/incidents';

const RealMapComponent = dynamic(() => import('./RealMapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
      <p className="text-gray-600">Loading map...</p>
    </div>
  ),
});

const mockIncidents: Incident[] = [
  {
    id: '1',
    title: "Suspicious Activity Near Park",
    type: "Suspicious Activity",
    address: "123 Main St",
    dateTime: "2024-09-15 14:30",
    reportedBy: "John Doe",
    description: "Saw someone loitering around the playground area",
    lat: 40.7128,
    lng: -74.0060,
    upvotes: 5,
    downvotes: 1,
    votedBy: []
  },
  {
    id: '2',
    title: "Break-in Attempt",
    type: "Break-in",
    address: "456 Oak Ave",
    dateTime: "2024-09-14 22:15",
    reportedBy: "Jane Smith",
    description: "Noticed someone trying to break into a car",
    lat: 40.7589,
    lng: -73.9851,
    upvotes: 3,
    downvotes: 0,
    votedBy: []
  }
];

const LandingPage: React.FC = () => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number]>([40.7128, -74.0060]);
  const [locationStatus, setLocationStatus] = useState<'loading' | 'allowed' | 'denied' | 'unavailable'>('loading');
  
  const { signIn, user } = useAuth();
  const router = useRouter();

  // Request location
  useEffect(() => {
    const requestLocation = () => {
      if (!navigator.geolocation) {
        setLocationStatus('unavailable');
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

    const timer = setTimeout(() => {
      requestLocation();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
  await signIn(loginForm.email, loginForm.password);
} catch (err: unknown) {
  console.error('Login error:', err);

    if (typeof err === 'object' && err !== null && 'code' in err) {
    const errorCode = (err as { code?: string }).code;

    if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
      setError('Invalid email or password');
    } else if (errorCode === 'auth/invalid-email') {
      setError('Invalid email address');
    } else if (errorCode === 'auth/invalid-credential') {
      setError('Invalid credentials');
    } else {
      setError('Failed to sign in. Please try again.');
    }
  } else {
    setError('An unexpected error occurred.');
  }
} finally {
  setIsLoading(false);
}

  };

  const EnableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('allowed');
        },
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-200px)]">
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Live Incident Map</h3>
                    <p className="text-sm text-gray-600">
                      {locationStatus === 'loading' && 'Requesting location...'}
                      {locationStatus === 'allowed' && 'Showing incidents in your area'}
                      {locationStatus === 'denied' && 'Location access denied'}
                      {locationStatus === 'unavailable' && 'Location not available'}
                    </p>
                  </div>
                  {locationStatus === 'denied' && (
                    <button
                      onClick={EnableLocation}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      title="Enable location to see incidents in your area"
                    >
                      <MapPin className="w-4 h-4" />
                      Enable
                    </button>
                  )}
                </div>
              </div>

              <div className="h-[400px]">
                <RealMapComponent 
                  incidents={mockIncidents}
                  height="400px"
                  center={userLocation}
                  zoom={locationStatus === 'allowed' ? 15 : 12}
                  key={`${userLocation[0]}-${userLocation[1]}`}
                />
              </div>
            </div>
            <div className="absolute -right-4 -top-4 bg-white rounded-lg shadow-lg p-4 w-32 z-10">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">24</div>
                <div className="text-xs text-gray-600">Reports Today</div>
              </div>
            </div>
            <div className="absolute -left-4 bottom-4 bg-white rounded-lg shadow-lg p-4 w-36 z-[1001]">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-xs text-gray-600">Community Safe</div>
              </div>
            </div>
          </div>

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
                <h2 className="text-2xl font-semibold text-gray-800">Welcome Back</h2>
                <p className="text-gray-600 mt-2">Sign in to access your neighborhood dashboard</p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black placeholder-gray-400"
                    style={{ color: '#000000' }}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400">
                    🔒
                  </div>
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black placeholder-gray-400"
                    style={{ color: '#000000' }}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600 mb-4">Don&#39;t have an account?</p>
                <button
                  onClick={() => router.push('/signup')}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors font-medium border-2 border-gray-200 hover:border-gray-300"
                  disabled={isLoading}
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
    </div>
  );
};

export default LandingPage;