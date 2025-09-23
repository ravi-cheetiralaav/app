'use client';

import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { MenuItem } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeEvent, setActiveEvent] = useState(null);

  useEffect(() => {
    loadMenuItems();
    loadActiveEvent();
  }, []);

  const loadMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data);
      } else {
        setError('Failed to load menu items');
      }
    } catch (err) {
      setError('Network error while loading menu');
    } finally {
      setLoading(false);
    }
  };

  const loadActiveEvent = async () => {
    try {
      const response = await fetch('/api/events/active');
      const data = await response.json();
      
      if (data.success) {
        setActiveEvent(data.data);
      }
    } catch (err) {
      console.error('Error loading active event:', err);
    }
  };

  const addToCart = (menuItem: MenuItem) => {
    if (menuItem.stockQuantity <= 0) return;
    
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      if (existingItem.quantity < menuItem.stockQuantity) {
        setCart(cart.map(item => 
          item.menuItem.id === menuItem.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { menuItem, quantity: 1 }]);
    }
  };

  const removeFromCart = (menuItemId: string) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItemId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.menuItem.id === menuItemId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.menuItem.id !== menuItemId));
    }
  };

  const getCartQuantity = (menuItemId: string): number => {
    return cart.find(item => item.menuItem.id === menuItemId)?.quantity || 0;
  };

  const getTotalPrice = (): number => {
    return cart.reduce((total, item) => total + (item.menuItem.price * item.quantity), 0);
  };

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Loading size="lg" text="Loading delicious menu items..." />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">😟 Oops!</div>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={loadMenuItems} 
              variant="primary" 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (menuItems.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Coming Soon!</h2>
            <p className="text-gray-600 mb-8">
              Our young chefs are preparing an amazing menu for you. Check back soon!
            </p>
            <Button 
              onClick={loadMenuItems}
              variant="primary"
            >
              Refresh Menu
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const categories = ['snacks', 'beverages', 'desserts'] as const;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-600 mt-2">Delicious treats made with love by kids!</p>
          
          {!activeEvent && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                ⚠️ No active event found. Please check with an admin to create an event for ordering.
              </p>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="mb-8 bg-primary-50 border-primary-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingCart className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-900">
                    {getTotalItems()} items in cart
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-bold text-primary-900">
                    {formatCurrency(getTotalPrice())}
                  </span>
                  <Button 
                    variant="primary"
                    onClick={() => window.location.href = '/checkout'}
                    disabled={!activeEvent}
                  >
                    Checkout
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Categories */}
        {categories.map(category => {
          const categoryItems = menuItems.filter(item => item.category === category);
          
          if (categoryItems.length === 0) return null;
          
          return (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize flex items-center">
                {category === 'snacks' && '🍿'}
                {category === 'beverages' && '🥤'}
                {category === 'desserts' && '🍰'}
                <span className="ml-2">{category}</span>
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map(item => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {item.imagePath && (
                      <div className="h-48 bg-gray-100">
                        <img 
                          src={item.imagePath} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                        <span className="text-xl font-bold text-primary-600">
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="text-sm text-gray-500">
                          <strong>Ingredients:</strong> {item.ingredients}
                        </div>
                        <div className="text-sm text-gray-500">
                          <strong>Calories:</strong> {item.calories} cal
                        </div>
                        <div className="text-sm text-green-600">
                          <strong>Health Benefits:</strong> {item.healthBenefits}
                        </div>
                        <div className="text-sm text-gray-500">
                          <strong>Available:</strong> {item.stockQuantity} left
                        </div>
                      </div>
                      
                      {item.stockQuantity <= 0 ? (
                        <div className="bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-center font-medium">
                          😞 Sold Out
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          {getCartQuantity(item.id) > 0 ? (
                            <div className="flex items-center space-x-3">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFromCart(item.id)}
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="font-medium min-w-[20px] text-center">
                                {getCartQuantity(item.id)}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => addToCart(item)}
                                disabled={getCartQuantity(item.id) >= item.stockQuantity}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="primary"
                              onClick={() => addToCart(item)}
                              disabled={!activeEvent}
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}