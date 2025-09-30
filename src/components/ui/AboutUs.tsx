'use client';

import React from 'react';
import { Shield, Users, Eye, Clock, MapPin, Heart } from 'lucide-react';
import Navigation from './Navigation';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About SafeNeighborhood
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering communities through transparency, collaboration, and real-time safety awareness. 
            Together, we're building safer neighborhoods one report at a time.
          </p>
        </div>

 
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center max-w-4xl mx-auto leading-relaxed">
            SafeNeighborhood exists to create stronger, more connected communities through transparent 
            incident reporting and real-time information sharing. We believe that when neighbors are 
            informed and engaged, everyone benefits from increased safety and peace of mind.
          </p>
        </div>


        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Eye className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Transparency</h3>
              <p className="text-gray-600">
                Open and honest communication builds trust. We provide clear, accessible information 
                about neighborhood incidents and safety trends.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                Strong neighborhoods are built on collaboration. We connect residents and encourage 
                active participation in community safety.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="flex items-center justify-center mb-4">
                <Heart className="w-12 h-12 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Care</h3>
              <p className="text-gray-600">
                We care about every member of our community. Our platform prioritizes user safety, 
                privacy, and well-being above all else.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Report</h3>
              <p className="text-sm text-gray-600">
                Easily report incidents in your neighborhood through our user-friendly platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Share</h3>
              <p className="text-sm text-gray-600">
                Information is shared with the community while protecting privacy and anonymity.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Stay Informed</h3>
              <p className="text-sm text-gray-600">
                Receive real-time updates about incidents and safety trends in your area.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Take Action</h3>
              <p className="text-sm text-gray-600">
                Work together with neighbors and authorities to address issues and improve safety.
              </p>
            </div>
          </div>
        </div>

     
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Making a Difference</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
              <p className="text-gray-600">Active Community Members</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">2,500+</div>
              <p className="text-gray-600">Incidents Reported</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">150+</div>
              <p className="text-gray-600">Neighborhoods Covered</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <p className="text-gray-600">Community Monitoring</p>
            </div>
          </div>
        </div>

     
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Commitment</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Privacy & Security</h3>
                <p className="text-gray-600 mb-4">
                  We take your privacy seriously. All reports are handled with the utmost care, 
                  and we provide options for anonymous reporting when needed.
                </p>
                <p className="text-gray-600 mb-6">
                  Our platform uses industry-standard security measures to protect your data 
                  and ensure safe communication within the community.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">99.9% Uptime</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-600">Encrypted Data</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8">
                <h4 className="font-semibold text-gray-900 mb-4">Emergency Notice</h4>
                <p className="text-gray-700 text-sm mb-4">
                  SafeNeighborhood is designed for non-emergency incident reporting and community 
                  awareness. For immediate emergencies requiring police, fire, or medical response:
                </p>
                <div className="bg-red-100 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 font-semibold text-center">
                    Always call 911 for emergencies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 opacity-90">
            Ready to help make your neighborhood safer? Join thousands of residents 
            who are already making a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <button
              onClick={() => window.location.href = '/signup'}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign Up Today
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Explore Platform
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;