'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { getUser, UserData } from '@/firebase/users'; 

const Navigation: React.FC = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const firestoreUser = await getUser(user.uid);
        setUserData(firestoreUser);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.uid]); // Refetch when user ID changes

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const navigateAndClose = (path: string) => {
    router.push(path);
    setMenuOpen(false);
  };

  // Gets display name
  const getDisplayName = (): string => {
    if (userData?.name) {
      return userData.name;
    }
    return user?.email || 'User';
  };

  // Gets display initial
  const getDisplayInitial = (): string => {
    if (userData?.name) {
      return userData.name.charAt(0).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push(user ? '/dashboard' : '/')}
        >
          SafeNeighborhood
        </h1>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/about')}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                About Us
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center gap-2 group"
                title="View Profile"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200 group-hover:border-blue-500 transition-colors shadow-sm">
                  {getDisplayInitial()}
                </div>
                <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                  {loading ? 'Loading...' : getDisplayName()}
                </span>
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateAndClose('/about')}
                className="text-gray-700 hover:text-blue-600 text-left transition-colors whitespace-nowrap"
              >
                About Us
              </button>
              <button
                onClick={() => navigateAndClose('/')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </>
          )}
        </div>

        {/* Mobile Layout Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-blue-600 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-4 flex flex-col space-y-3">
          {user ? (
            <>
              <button
                onClick={() => navigateAndClose('/dashboard')}
                className="text-gray-700 hover:text-blue-600 text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateAndClose('/about')}
                className="text-gray-700 hover:text-blue-600 text-left"
              >
                About Us
              </button>
              <button
                onClick={() => navigateAndClose('/profile')}
                className="flex items-center gap-2 text-left"
                title="View Profile"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-gray-200">
                  {getDisplayInitial()}
                </div>
                <span className="text-sm text-gray-600">
                  {loading ? 'Loading...' : getDisplayName()}
                </span>
              </button>
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false); }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigateAndClose('/about')}
                className="text-gray-700 hover:text-blue-600 text-left"
              >
                About Us
              </button>
              <button
                onClick={() => navigateAndClose('/')}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Login
              </button>
            </>            
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;