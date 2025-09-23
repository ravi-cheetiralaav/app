'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Menu, Calendar, ShoppingCart, MessageSquare, QrCode } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeOrders: 0,
    menuItems: 0,
    upcomingEvents: 0,
  });

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome to the TKFC management panel</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-primary-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-secondary-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Menu Items</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.menuItems}</p>
                </div>
                <Menu className="w-8 h-8 text-accent-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Events</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                </div>
                <Calendar className="w-8 h-8 text-primary-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Management Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Management Panel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="w-5 h-5 mr-3" />
                Manage Users
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/menu'}
              >
                <Menu className="w-5 h-5 mr-3" />
                Manage Menu
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/events'}
              >
                <Calendar className="w-5 h-5 mr-3" />
                Manage Events
              </Button>
            </CardContent>
          </Card>

          {/* Operations Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="secondary"
                size="lg"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/orders'}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                View All Orders
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/qr-scanner'}
              >
                <QrCode className="w-5 h-5 mr-3" />
                QR Code Scanner
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full justify-start"
                onClick={() => window.location.href = '/admin/feedback'}
              >
                <MessageSquare className="w-5 h-5 mr-3" />
                Customer Feedback
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity (placeholder) */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Activity will appear here once users start placing orders</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}