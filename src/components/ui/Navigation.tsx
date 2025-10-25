'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
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
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
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
                onClick={() => { router.push('/dashboard'); setMenuOpen(false); }}
                className="text-gray-700 hover:text-blue-600 text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => { router.push('/about'); setMenuOpen(false); }}
                className="text-gray-700 hover:text-blue-600 text-left"
              >
                About Us
              </button>
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={() => { handleSignOut(); setMenuOpen(false); }}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => { router.push('/'); setMenuOpen(false); }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navigation;
