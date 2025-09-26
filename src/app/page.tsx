'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ShoppingCart, Calendar, Users, Star } from 'lucide-react';

export default function HomePage() {
  const [loginMode, setLoginMode] = useState<'customer' | 'admin' | null>(null);
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/menu';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = '/admin';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showHeader={false}>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-6">
          <div className="w-24 h-24 mx-auto bg-primary-500 rounded-full flex items-center justify-center shadow-xl animate-bounce-slow">
            <span className="text-white text-4xl">🍔</span>
          </div>
          
          <div className="space-y-2">
            <h1 className="font-display text-5xl md:text-6xl font-bold text-primary-600">
              TKFC
            </h1>
            <p className="text-xl md:text-2xl text-primary-500 font-medium">
              Kids Food Company
            </p>
            <p className="text-gray-600 max-w-md mx-auto">
              Welcome to our special holiday food & beverage ordering system!
              Place your orders and enjoy delicious treats made by kids.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <ShoppingCart className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Easy Ordering</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Calendar className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Event-Based</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-accent-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Community</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg shadow-sm">
              <Star className="w-8 h-8 text-primary-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-700">Quality</p>
            </div>
          </div>
        </div>

        {/* Login Section */}
        <div className="w-full max-w-md">
          {!loginMode ? (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">Get Started</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setLoginMode('customer')}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  🛒 Customer Login
                </Button>
                <Button
                  onClick={() => setLoginMode('admin')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  ⚙️ Admin Login
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="text-center">
                  {loginMode === 'customer' ? '🛒 Customer Login' : '⚙️ Admin Login'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginMode === 'customer' ? handleCustomerLogin : handleAdminLogin} className="space-y-4">
                  {loginMode === 'customer' ? (
                    <Input
                      label="User ID"
                      placeholder="e.g., John_ST_12"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      helperText="Format: FirstName_StreetCode_HouseNumber"
                    />
                  ) : (
                    <>
                      <Input
                        label="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                      <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </>
                  )}

                  {error && (
                    <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setLoginMode(null);
                        setError('');
                        setUserId('');
                        setUsername('');
                        setPassword('');
                      }}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                      className="flex-1"
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-12 text-center max-w-2xl">
          <p className="text-sm text-gray-500">
            🎯 <strong>For Customers:</strong> Use your assigned User ID to login and place orders<br />
            🔧 <strong>For Admins:</strong> Manage users, menu items, and events
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
