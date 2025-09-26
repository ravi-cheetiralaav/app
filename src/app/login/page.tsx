'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // For now, just redirect to menu
      window.location.href = '/menu';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-kid-friendly p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              <Image
                src="/logo.jpg"
                alt="TKFC Logo"
                fill
                className="rounded-2xl object-cover animate-gentle-bounce"
              />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent-yellow rounded-full flex items-center justify-center">
                <span className="text-sm">🔑</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back! 👋
            </h1>
            
            <p className="text-gray-600">
              Enter your User ID to start ordering
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label 
                htmlFor="userId" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your User ID 🆔
              </label>
              
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g., Ravi_ST_12"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-primary-500 focus:outline-none transition-colors text-lg"
                required
              />
              
              <p className="text-sm text-gray-500 mt-2">
                Format: FirstName_StreetCode_HouseNumber
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !userId.trim()}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Logging in...
                </>
              ) : (
                <>
                  🚀 Login & Start Ordering
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 p-4 bg-primary-50 rounded-2xl">
            <h3 className="font-semibold text-primary-800 mb-2">
              Need Help? 🤔
            </h3>
            
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• Don&apos;t have a User ID? Ask an admin to create one!</li>
              <li>• Forgot your User ID? Check with your parents</li>
              <li>• Having trouble? Contact us for assistance</li>
            </ul>
          </div>

          {/* Sample IDs for Demo */}
          <div className="mt-6 p-4 bg-accent-yellow/10 rounded-2xl border border-accent-yellow/20">
            <h3 className="font-semibold text-gray-800 mb-2">
              🧪 Try these demo User IDs:
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {['Ravi_ST_12', 'Sarah_AV_45', 'Mike_PL_23'].map((demoId) => (
                <button
                  key={demoId}
                  onClick={() => setUserId(demoId)}
                  className="text-xs bg-white px-3 py-2 rounded-lg border hover:bg-primary-50 transition-colors"
                >
                  {demoId}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>🔒 Your data is safe and secure with us</p>
        </div>
      </div>
    </div>
  );
}