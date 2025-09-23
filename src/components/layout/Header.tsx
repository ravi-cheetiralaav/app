'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LogOut, Menu, X, ShoppingCart, User } from 'lucide-react';

interface HeaderProps {
  user?: {
    userId: string;
    firstName: string;
    greetingWord: string;
  } | null;
  isAdmin?: boolean;
  onLogout?: () => void;
}

export const Header = ({ user, isAdmin, onLogout }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg">🍔</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">TKFC</h1>
              <p className="text-xs text-primary-100">Kids Food Company</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {user && !isAdmin && (
              <>
                <a href="/menu" className="hover:text-primary-200 transition-colors">
                  Menu
                </a>
                <a href="/orders" className="hover:text-primary-200 transition-colors flex items-center space-x-1">
                  <ShoppingCart size={16} />
                  <span>My Orders</span>
                </a>
                <a href="/feedback" className="hover:text-primary-200 transition-colors">
                  Feedback
                </a>
              </>
            )}
            
            {isAdmin && (
              <>
                <a href="/admin" className="hover:text-primary-200 transition-colors">
                  Dashboard
                </a>
                <a href="/admin/users" className="hover:text-primary-200 transition-colors">
                  Users
                </a>
                <a href="/admin/menu" className="hover:text-primary-200 transition-colors">
                  Menu
                </a>
                <a href="/admin/events" className="hover:text-primary-200 transition-colors">
                  Events
                </a>
              </>
            )}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="hidden md:flex items-center space-x-2">
                <User size={16} />
                <span className="text-sm">
                  {isAdmin ? 'Admin' : `${user.greetingWord} ${user.firstName}!`}
                </span>
              </div>
            )}
            
            {user && onLogout && (
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-white text-white hover:bg-white hover:text-primary-500"
              >
                <LogOut size={16} className="mr-1" />
                Logout
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-primary-400">
            <nav className="flex flex-col space-y-2">
              {user && !isAdmin && (
                <>
                  <a href="/menu" className="py-2 hover:text-primary-200 transition-colors">
                    Menu
                  </a>
                  <a href="/orders" className="py-2 hover:text-primary-200 transition-colors">
                    My Orders
                  </a>
                  <a href="/feedback" className="py-2 hover:text-primary-200 transition-colors">
                    Feedback
                  </a>
                </>
              )}
              
              {isAdmin && (
                <>
                  <a href="/admin" className="py-2 hover:text-primary-200 transition-colors">
                    Dashboard
                  </a>
                  <a href="/admin/users" className="py-2 hover:text-primary-200 transition-colors">
                    Users
                  </a>
                  <a href="/admin/menu" className="py-2 hover:text-primary-200 transition-colors">
                    Menu
                  </a>
                  <a href="/admin/events" className="py-2 hover:text-primary-200 transition-colors">
                    Events
                  </a>
                </>
              )}
              
              {user && (
                <div className="py-2 text-sm border-t border-primary-400 mt-2 pt-4">
                  {isAdmin ? 'Admin' : `${user.greetingWord} ${user.firstName}!`}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};