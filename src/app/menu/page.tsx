'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Sample menu data
const menuItems = [
  {
    id: 1,
    name: "Fresh Fruit Salad",
    price: 8.50,
    image: "🥗",
    category: "snacks",
    stock: 25,
    ingredients: ["Apple", "Orange", "Grapes", "Strawberry", "Honey"],
    calories: 120,
    healthBenefits: ["Rich in Vitamin C", "Natural antioxidants", "Fiber boost"]
  },
  {
    id: 2,
    name: "Chocolate Chip Cookies",
    price: 3.00,
    image: "🍪",
    category: "desserts",
    stock: 50,
    ingredients: ["Flour", "Chocolate chips", "Butter", "Sugar"],
    calories: 180,
    healthBenefits: ["Energy boost", "Comfort food"]
  },
  {
    id: 3,
    name: "Fresh Orange Juice",
    price: 4.50,
    image: "🍊",
    category: "beverages",
    stock: 30,
    ingredients: ["Fresh oranges", "Natural pulp"],
    calories: 110,
    healthBenefits: ["Vitamin C", "Natural hydration", "Immune support"]
  },
  {
    id: 4,
    name: "Veggie Wraps",
    price: 6.75,
    image: "🌯",
    category: "snacks",
    stock: 20,
    ingredients: ["Tortilla", "Lettuce", "Tomato", "Cucumber", "Hummus"],
    calories: 280,
    healthBenefits: ["Protein rich", "Healthy fats", "Fiber content"]
  },
  {
    id: 5,
    name: "Homemade Lemonade",
    price: 3.50,
    image: "🍋",
    category: "beverages",
    stock: 40,
    ingredients: ["Fresh lemons", "Water", "Natural sugar"],
    calories: 80,
    healthBenefits: ["Vitamin C", "Refreshing", "Natural sweetener"]
  },
  {
    id: 6,
    name: "Mini Cupcakes",
    price: 2.50,
    image: "🧁",
    category: "desserts",
    stock: 0, // Sold out
    ingredients: ["Flour", "Vanilla", "Frosting", "Sprinkles"],
    calories: 150,
    healthBenefits: ["Perfect treat size"]
  }
];

const categories = [
  { id: 'all', name: 'All Items', emoji: '🍽️' },
  { id: 'snacks', name: 'Snacks', emoji: '🥨' },
  { id: 'beverages', name: 'Beverages', emoji: '🥤' },
  { id: 'desserts', name: 'Desserts', emoji: '🍰' }
];

export default function MenuPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<{[key: number]: number}>({});

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (itemId: number) => {
    const item = menuItems.find(i => i.id === itemId);
    if (item && item.stock > (cart[itemId] || 0)) {
      setCart(prev => ({
        ...prev,
        [itemId]: (prev[itemId] || 0) + 1
      }));
    }
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1)
    }));
  };

  const getTotalItems = () => Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const getTotalPrice = () => {
    return Object.entries(cart).reduce((sum, [itemId, qty]) => {
      const item = menuItems.find(i => i.id === Number(itemId));
      return sum + (item ? item.price * qty : 0);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.jpg"
                  alt="TKFC Logo"
                  width={40}
                  height={40}
                  className="rounded-lg"
                />
                <span className="text-xl font-bold text-primary-600">TKFC Menu</span>
              </Link>
            </div>

            {/* Cart Summary */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-primary-600 hover:text-primary-700">
                Login
              </Link>
              
              <div className="bg-primary-500 text-white px-4 py-2 rounded-2xl flex items-center gap-2">
                <span className="text-2xl">🛒</span>
                <span className="font-semibold">
                  {getTotalItems()} items · ${getTotalPrice().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Delicious Menu! 🍽️
          </h1>
          <p className="text-xl text-gray-600">
            Fresh, healthy, and made with love by kids! 💚
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'bg-white text-gray-700 hover:bg-primary-50 shadow-soft'
              }`}
            >
              <span className="text-xl">{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              quantity={cart[item.id] || 0}
              onAdd={() => addToCart(item.id)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🤷‍♀️</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No items in this category
            </h3>
            <p className="text-gray-500">Try selecting a different category!</p>
          </div>
        )}

        {/* Checkout Section */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-6 right-6 bg-primary-500 text-white p-6 rounded-3xl shadow-kid-friendly animate-pulse">
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <div className="font-bold text-lg mb-1">
                {getTotalItems()} items in cart
              </div>
              <div className="text-primary-100 mb-4">
                Total: ${getTotalPrice().toFixed(2)}
              </div>
              <Link 
                href="/checkout" 
                className="bg-white text-primary-600 px-6 py-3 rounded-2xl font-semibold hover:bg-primary-50 transition-colors inline-block"
              >
                Checkout 🚀
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

interface MenuItemCardProps {
  item: typeof menuItems[0];
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function MenuItemCard({ item, quantity, onAdd, onRemove }: MenuItemCardProps) {
  const isOutOfStock = item.stock === 0;
  const canAddMore = quantity < item.stock;

  return (
    <div className={`bg-white rounded-3xl p-6 shadow-soft hover:shadow-kid-friendly transition-all duration-300 ${isOutOfStock ? 'opacity-60' : 'hover:-translate-y-2'}`}>
      {/* Item Header */}
      <div className="relative mb-4">
        <div className="text-6xl mb-4 text-center animate-gentle-bounce">
          {item.image}
        </div>
        
        {isOutOfStock && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold transform rotate-12">
            SOLD OUT
          </div>
        )}
        
        {!isOutOfStock && item.stock <= 5 && (
          <div className="absolute -top-2 -right-2 bg-accent-orange text-white px-3 py-1 rounded-full text-sm font-bold">
            Only {item.stock} left!
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-2xl font-bold text-primary-500 mb-2">${item.price}</p>
        <p className="text-sm text-gray-500 mb-2">Stock: {item.stock}</p>
      </div>

      {/* Nutrition Info */}
      <div className="mb-4 space-y-2">
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Ingredients:</span>
          <p className="text-gray-600">{item.ingredients.join(', ')}</p>
        </div>
        
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Calories:</span>
          <span className="text-gray-600 ml-2">{item.calories}</span>
        </div>
        
        <div className="text-sm">
          <span className="font-semibold text-gray-700">Health Benefits:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {item.healthBenefits.map((benefit, index) => (
              <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">
                {benefit}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add to Cart */}
      {!isOutOfStock ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onRemove}
              disabled={quantity === 0}
              className="w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-full flex items-center justify-center font-bold text-xl transition-colors"
            >
              -
            </button>
            
            <span className="font-bold text-xl min-w-[2rem] text-center">
              {quantity}
            </span>
            
            <button
              onClick={onAdd}
              disabled={!canAddMore}
              className="w-10 h-10 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 text-white rounded-full flex items-center justify-center font-bold text-xl transition-colors"
            >
              +
            </button>
          </div>
          
          {quantity > 0 && (
            <div className="text-sm font-semibold text-primary-600">
              ${(item.price * quantity).toFixed(2)}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-gray-200 text-gray-500 py-3 px-6 rounded-2xl font-semibold">
            Out of Stock 😢
          </div>
        </div>
      )}
    </div>
  );
}