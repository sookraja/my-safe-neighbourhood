'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Calendar, Shield, TrendingUp, FileText, LogOut, Edit2, Save, X, Trash2 } from 'lucide-react';
import Navigation from '@/components/ui/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getIncidents, Incident, getCredibilityScore, deleteIncident } from '@/firebase/incidents';
import { getUser, updateUser } from '@/firebase/users';

const ProfilePage: React.FC = () => {
  const { user, logOut } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userIncidents, setUserIncidents] = useState<Incident[]>([]);
  const [deletingIncidentId, setDeletingIncidentId] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || 'User',
    email: user?.email || '',
    joinDate: user?.metadata?.creationTime || new Date().toISOString(),
  });

  const [editData, setEditData] = useState(profileData);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    loadUserData();
  }, [user, router]);

  const loadUserData = async () => {
    if (!user?.uid) return; 
    try {
      setLoading(true);
      const incidents = await getIncidents();
      
      const firestoreUser = await getUser(user.uid);
      const username = firestoreUser?.name?.trim() || user?.email?.split('@')[0] || 'User';

      setProfileData({
        displayName: username,
        email: user?.email || '',
        joinDate: user?.metadata?.creationTime || new Date().toISOString(),
      });

      setEditData({
        displayName: username,
        email: user?.email || '',
        joinDate: user?.metadata?.creationTime || new Date().toISOString(),
      });

      // Filter incidents to only show user's own incidents
      const userReports = incidents.filter(
        incident => incident.userId === user.uid || incident.reportedBy === user?.email
      );
      setUserIncidents(userReports);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncident = async (incidentId: string) => {
    if (!user?.uid) return;
    
    if (!confirm('Are you sure you want to delete this incident? This action cannot be undone.')) {
      return;
    }

  try {
    setDeletingIncidentId(incidentId);
    await deleteIncident(incidentId, user.uid);
    
    setUserIncidents(prev => prev.filter(incident => incident.id !== incidentId));
    await loadUserData();
    
  } catch (error: unknown) {
    console.error('Error deleting incident:', error);
    if (error instanceof Error) {
      alert(error.message || 'Failed to delete incident');
    } else {
      alert('Failed to delete incident');
    }
  } finally {
    setDeletingIncidentId(null);
  }
};

  const handleSaveProfile = async () => {
    if (!user?.uid) return;
    
    // Validate input
    if (!editData.displayName.trim()) {
      alert('Please enter a valid display name');
      return;
    }

    if (editData.displayName.length > 30) {
      alert('Display name must be less than 30 characters');
      return;
    }

    setSaving(true);
    try {
      // Update the user's name in Firestore
      await updateUser(user.uid, {
        name: editData.displayName.trim()
      });

      // Update local state
      setProfileData(editData);
      setIsEditing(false);

      // reload to update components
      window.location.reload();
      
      // Reload incidents to reflect name change in reports list
      await loadUserData();
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await logOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const totalReports = userIncidents.length;
  const verifiedReports = userIncidents.filter(i => getCredibilityScore(i) >= 5).length;
  const totalUpvotes = userIncidents.reduce((sum, i) => sum + (i.upvotes || 0), 0);
  const totalVotes = userIncidents.reduce((sum, i) => sum + (i.upvotes || 0) + (i.downvotes || 0), 0);
  const credibilityRating = totalVotes > 0 ? Math.round((totalUpvotes / totalVotes) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profileData.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  {isEditing ? (
                    <div className="mb-2">
                      <input
                        type="text"
                        value={editData.displayName}
                        onChange={(e) => setEditData({ ...editData, displayName: e.target.value })}
                        className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 focus:outline-none px-2 bg-transparent"
                        style={{ color: '#000000' }}
                        placeholder="Enter your display name"
                        maxLength={30}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {editData.displayName.length}/30 characters
                      </div>
                    </div>
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900">{profileData.displayName}</h1>
                  )}
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Joined {new Date(profileData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={saving}
                      className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 text-sm sm:text-base bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                credibilityRating >= 80 ? 'bg-green-100 text-green-800' :
                credibilityRating >= 60 ? 'bg-blue-100 text-blue-800' :
                credibilityRating >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                <Shield className="w-4 h-4" />
                {credibilityRating >= 80 ? 'Trusted Reporter' :
                 credibilityRating >= 60 ? 'Active Reporter' :
                 credibilityRating >= 40 ? 'New Reporter' :
                 'Getting Started'}
              </span>
              <span className="text-sm text-gray-600">
                {credibilityRating}% credibility rating
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8 text-blue-600" />
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalReports}</div>
              <div className="text-sm text-gray-600">Total Reports</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{verifiedReports}</div>
              <div className="text-sm text-gray-600">Verified Reports</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{totalUpvotes}</div>
              <div className="text-sm text-gray-600">Total Upvotes</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <User className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{credibilityRating}%</div>
              <div className="text-sm text-gray-600">Credibility Score</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Your Recent Reports</h2>
              <span className="text-sm text-gray-500">
                {userIncidents.length} report{userIncidents.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            {userIncidents.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">You haven&apos;t reported any incidents yet.</p>
                <button
                  onClick={() => router.push('/report')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Report Your First Incident
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userIncidents.slice(0, 10).map((incident) => {
                  const score = getCredibilityScore(incident);
                  return (
                    <div
                      key={incident.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">{incident.title}</h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              incident.type === 'Violence' || incident.type === 'Robbery' ? 'bg-red-100 text-red-800' :
                              incident.type === 'Theft' || incident.type === 'Break-in' ? 'bg-orange-100 text-orange-800' :
                              incident.type === 'Vandalism' ? 'bg-yellow-100 text-yellow-800' :
                              incident.type === 'Suspicious Activity' ? 'bg-purple-100 text-purple-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {incident.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{incident.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {incident.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {incident.dateTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 ml-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-green-600 font-medium">
                              ↑ {incident.upvotes || 0}
                            </span>
                            <span className="text-sm text-red-600 font-medium">
                              ↓ {incident.downvotes || 0}
                            </span>
                          </div>
                          <span className={`text-xs font-semibold ${
                            score >= 5 ? 'text-green-600' :
                            score >= 0 ? 'text-gray-600' :
                            'text-red-600'
                          }`}>
                            Score: {score > 0 ? '+' : ''}{score}
                          </span>
                          <button
                            onClick={() => handleDeleteIncident(incident.id!)}
                            disabled={deletingIncidentId === incident.id}
                            className="flex items-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete incident"
                          >
                            {deletingIncidentId === incident.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {userIncidents.length > 10 && (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View all {userIncidents.length} reports →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;