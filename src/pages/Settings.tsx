import React, { useState, useEffect } from 'react';
    import { supabase } from '../lib/supabase';
    import { useAuthStore } from '../stores/authStore';
    import { Plus, Edit, Trash2, AlertCircle, Lock } from 'lucide-react';
    import ProfileModal from '../components/ProfileModal';
    import VehicleModal from '../components/VehicleModal';
    import PasswordModal from '../components/PasswordModal';
    import { useNavigate } from 'react-router-dom';

    interface Profile {
      id: string;
      full_name: string;
      email: string;
      role: 'admin' | 'user';
      badge_number: string | null;
    }

    function Settings() {
      const { isAdmin, profile, setProfile } = useAuthStore();
      const [profiles, setProfiles] = useState<Profile[]>([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState<string | null>(null);
      const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
      const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
      const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
      const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
      const navigate = useNavigate();

      useEffect(() => {
        if (isAdmin) {
          fetchProfiles();
        }
      }, [isAdmin]);

      async function fetchProfiles() {
        setLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, role, badge_number');

          if (error) throw error;
          setProfiles(data || []);
        } catch (err) {
          setError('Failed to fetch user profiles.');
          console.error('Error fetching profiles:', err);
        } finally {
          setLoading(false);
        }
      }

      const handleCreateProfile = () => {
        setSelectedProfile(null);
        setIsCreateModalOpen(true);
      };

      const handleEditProfile = (profile: Profile) => {
        setSelectedProfile(profile);
        setIsEditModalOpen(true);
      };

      const handleResetPassword = (profile: Profile) => {
        setSelectedProfile(profile);
        setIsPasswordModalOpen(true);
      };

      const handleDeleteProfile = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this profile?')) {
          setLoading(true);
          setError(null);
          try {
            const { error } = await supabase.from('profiles').delete().eq('id', id);
            if (error) throw error;
            setProfiles(profiles.filter((profile) => profile.id !== id));
          } catch (err) {
            setError('Failed to delete user profile.');
            console.error('Error deleting profile:', err);
          } finally {
            setLoading(false);
          }
        }
      };

      const handleUpdatePassword = () => {
        setSelectedProfile(profile);
        setIsPasswordModalOpen(true);
      };

      const handleCreateVehicle = () => {
        setIsVehicleModalOpen(true);
      };

      return (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {isAdmin && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                <button
                  onClick={handleCreateProfile}
                  className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New User
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full leading-normal">
                    <thead>
                      <tr>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Full Name
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Badge Number
                        </th>
                        <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((profile) => (
                        <tr key={profile.id}>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{profile.full_name}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{profile.email}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                              <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                              <span className="relative">{profile.role}</span>
                            </span>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <p className="text-gray-900 whitespace-no-wrap">{profile.badge_number || 'N/A'}</p>
                          </td>
                          <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditProfile(profile)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleResetPassword(profile)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Lock className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProfile(profile.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Vehicle Management</h2>
                <button
                  onClick={handleCreateVehicle}
                  className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Vehicle
                </button>
              </div>

              {isCreateModalOpen && (
                <ProfileModal
                  isOpen={isCreateModalOpen}
                  onClose={() => setIsCreateModalOpen(false)}
                  onProfileUpdate={fetchProfiles}
                />
              )}

              {isEditModalOpen && selectedProfile && (
                <ProfileModal
                  isOpen={isEditModalOpen}
                  onClose={() => setIsEditModalOpen(false)}
                  profile={selectedProfile}
                  onProfileUpdate={fetchProfiles}
                />
              )}

              {isPasswordModalOpen && selectedProfile && (
                <PasswordModal
                  isOpen={isPasswordModalOpen}
                  onClose={() => setIsPasswordModalOpen(false)}
                  profile={selectedProfile}
                  onProfileUpdate={fetchProfiles}
                />
              )}

              {isVehicleModalOpen && (
                <VehicleModal
                  isOpen={isVehicleModalOpen}
                  onClose={() => setIsVehicleModalOpen(false)}
                  onVehicleUpdate={() => {}}
                />
              )}
            </>
          )}

          {!isAdmin && (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h2>
              <button
                onClick={handleUpdatePassword}
                className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700"
              >
                <Lock className="w-4 h-4 mr-2" />
                Update Password
              </button>

              {isPasswordModalOpen && selectedProfile && (
                <PasswordModal
                  isOpen={isPasswordModalOpen}
                  onClose={() => {
                    setIsPasswordModalOpen(false);
                    setSelectedProfile(null);
                  }}
                  profile={profile}
                  onProfileUpdate={() => {
                    // Fetch the updated profile after password change
                    supabase.auth.getSession().then(({ data: { session } }) => {
                      if (session) {
                        supabase.auth.getUser().then(({ data: { user } }) => {
                          if (user) {
                            supabase
                              .from('profiles')
                              .select('*')
                              .eq('id', user.id)
                              .single()
                              .then(({ data, error }) => {
                                if (error) {
                                  console.error('Error fetching updated profile:', error);
                                } else if (data) {
                                  setProfile(data as Profile);
                                }
                              });
                          }
                        });
                      }
                    });
                  }}
                />
              )}
            </>
          )}
        </div>
      );
    }

    export default Settings;
