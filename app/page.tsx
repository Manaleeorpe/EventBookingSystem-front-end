'use client'

import React from 'react';

export default function Home() {
  // 👉 Call backend auth endpoint (triggers redirect to Google)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google/login`;
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1800&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-pink-400/40 backdrop-blur-sm"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Chat Application
        </h1>
        <p className="text-gray-600 mb-6">
          Sign in with your Google Account
        </p>

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow-md transition"
        >
          LOGIN WITH GOOGLE
        </button>

        {/* Footer Links */}
        <div className="flex justify-center gap-4 mt-6 text-sm text-gray-500">
          <a href="#" className="hover:underline">
            Terms of use
          </a>
          <a href="#" className="hover:underline">
            Privacy policy
          </a>
        </div>
      </div>
    </div>
  );
}