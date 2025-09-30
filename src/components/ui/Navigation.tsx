import React from 'react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">SafeNeighborhood</h1>
        <div className="flex items-center space-x-6">
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            Dashboard
          </button>
          <button  onClick={() => window.location.href = '/about'}
            className="text-gray-600 hover:text-blue-600 transition-colors">
            About Us
          </button>
          <button className="text-gray-600 hover:text-blue-600 transition-colors">
            Contact Us
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;