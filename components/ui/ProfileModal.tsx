'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UserSession {
  id?: string;
    name?: string;
    email?: string;
    googleId?: string;
    picture?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  useEffect(() => {
    if (!isOpen) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/auth/google/me`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUser(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load session');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogout = () => {
    // Redirect to logout URL
    window.location.href = 'http://localhost:8080/auth/google/logout';
  };

  const handleLogin = () => {
    // Redirect to login URL
    window.location.href = 'http://localhost:8080/auth/google/login';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading user info...</p>
            </div>
          ) : error || !user ? (
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Not Authenticated</h2>
                <p className="text-gray-600 mb-6">Please login to view your profile</p>
              </div>
              <button
                onClick={handleLogin}
                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg shadow hover:bg-red-600 transition-colors font-medium"
              >
                Login with Google
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Profile</h2>
              
              {/* Profile Picture */}
              {user?.picture ? (
                <img
                  src={user?.picture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}

              {/* User Info */}
              <div className="mb-6">
                <p className="text-lg font-semibold text-gray-800 mb-1">
                  {user?.name || 'Unknown User'}
                </p>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              {/* User ID (if available) */}
              {user?.id && (
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">User ID</p>
                  <p className="text-sm font-mono text-gray-700">{user.id}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                
              
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-50 text-red-600 px-4 py-3 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-200"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}