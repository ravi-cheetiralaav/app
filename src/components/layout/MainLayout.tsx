'use client';

import { ReactNode, useEffect, useState } from 'react';
import { Header } from './Header';

interface User {
  userId: string;
  firstName: string;
  greetingWord: string;
}

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const MainLayout = ({ children, showHeader = true }: MainLayoutProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (this would typically check a session/token)
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // This is a placeholder - in a real app, you'd check the session
      // For now, we'll just set loading to false
      setLoading(false);
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setUser(null);
        setIsAdmin(false);
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary-500 rounded-full flex items-center justify-center animate-bounce">
            <span className="text-white text-2xl">🍔</span>
          </div>
          <h2 className="text-xl font-display text-primary-600">Loading TKFC...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      {showHeader && (
        <Header user={user} isAdmin={isAdmin} onLogout={handleLogout} />
      )}
      
      <main className={showHeader ? 'pt-4' : ''}>
        {children}
      </main>
      
      {/* Footer */}
      <footer className="mt-12 bg-gray-100 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>🍔 TKFC - Kids Food Company © 2024</p>
            <p className="mt-1">Made with ❤️ by kids, for the community</p>
          </div>
        </div>
      </footer>
    </div>
  );
};