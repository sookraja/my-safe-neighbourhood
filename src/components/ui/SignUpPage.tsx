'use client';

import React, { useState } from 'react';
import Navigation from './Navigation';
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import app from "../../firebase/firebase";

const db = getFirestore(app);

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const [name, setUsernamem] = useState("");
  const [password_hash, setPassHash] = useState("");
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  }
);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    setForm(form);
    setEmail(form.email);
    setId("1");                                 // TO-DO: implement unique id
    setUsernamem(form.username);
    setPassHash(form.password);                 // TO-DO: implement hash value?
    setRole("default");                         // TO-DO: not sure what "role" value should be set to

    addDoc(collection(db, "Users"), {email, id, name, password_hash, role});

    alert('Registration successful!');
    // Here you would typically redirect to dashboard or login
    // Here blend you should be able to redirect to the incident/dashboard page after login
  };

  const handleGoToLogin = () => {
    // This should be able to handle login after sign ups
    alert('Navigate to login page - implement routing later!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <h1 className="text-3xl font-bold text-blue-600">SafeNeighborhood</h1>
              <div className="ml-2 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-blue-600 rounded-sm"></div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              style={{ color: '#000000' }}
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <input
              type="text"
              placeholder="Username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              style={{ color: '#000000' }}
              value={form.username}
              onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              style={{ color: '#000000' }}
              value={form.password}
              onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Re-enter Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-gray-400"
              style={{ color: '#000000' }}
              value={form.confirmPassword}
              onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Sign-up
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={handleGoToLogin}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-gray-200 py-8">
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

export default SignUpPage;