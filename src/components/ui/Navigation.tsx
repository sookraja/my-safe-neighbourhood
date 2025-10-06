'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Navigation: React.FC = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();

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
        <div className="flex items-center space-x-6">
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
      </div>
    </nav>
  );
};

export default Navigation;