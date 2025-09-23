import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Create sample users
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        streetName: 'Main Street',
        streetCode: 'MS',
        houseNumber: '123',
        greetingWord: 'Hello'
      },
      {
        firstName: 'Sarah',
        lastName: 'Smith',
        streetName: 'Oak Avenue',
        streetCode: 'OA',
        houseNumber: '456',
        greetingWord: 'Hi'
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        streetName: 'Elm Drive',
        streetCode: 'ED',
        houseNumber: '789',
        greetingWord: 'Hey'
      }
    ];

    for (const user of sampleUsers) {
      try {
        await db.createUser(user);
      } catch (error) {
        // User might already exist, skip
      }
    }

    // Create sample event
    const eventDate = new Date();
    eventDate.setDate(eventDate.getDate() + 7); // Event in 7 days
    
    const sampleEvent = {
      name: 'Holiday Food Festival',
      eventDate: eventDate.toISOString().split('T')[0]
    };

    let event;
    try {
      event = await db.createEvent(sampleEvent);
    } catch (error) {
      // Event might exist, get active event
      event = await db.getActiveEvent();
    }

    // Create sample menu items
    const sampleMenuItems = [
      {
        name: 'Mini Pizzas',
        description: 'Homemade mini pizzas with cheese and fresh vegetables',
        price: 5.99,
        category: 'snacks' as const,
        ingredients: 'Pizza dough, tomato sauce, mozzarella cheese, bell peppers, mushrooms',
        calories: 180,
        healthBenefits: 'Rich in calcium and vitamins from fresh vegetables',
        stockQuantity: 20
      },
      {
        name: 'Fruit Smoothie',
        description: 'Fresh fruit smoothie with banana, strawberries, and yogurt',
        price: 3.50,
        category: 'beverages' as const,
        ingredients: 'Banana, strawberries, greek yogurt, honey, milk',
        calories: 120,
        healthBenefits: 'High in vitamins C and K, probiotics from yogurt',
        stockQuantity: 15
      },
      {
        name: 'Chocolate Chip Cookies',
        description: 'Freshly baked chocolate chip cookies made with love',
        price: 2.25,
        category: 'desserts' as const,
        ingredients: 'Flour, butter, brown sugar, chocolate chips, eggs, vanilla',
        calories: 95,
        healthBenefits: 'Made with organic ingredients and dark chocolate',
        stockQuantity: 30
      },
      {
        name: 'Veggie Wraps',
        description: 'Healthy wraps filled with fresh vegetables and hummus',
        price: 4.75,
        category: 'snacks' as const,
        ingredients: 'Whole wheat tortilla, hummus, lettuce, tomatoes, cucumbers, carrots',
        calories: 160,
        healthBenefits: 'High in fiber, vitamins, and plant-based protein',
        stockQuantity: 12
      },
      {
        name: 'Fresh Lemonade',
        description: 'Homemade lemonade with real lemons and natural sweetener',
        price: 2.75,
        category: 'beverages' as const,
        ingredients: 'Fresh lemons, water, honey, mint leaves',
        calories: 60,
        healthBenefits: 'Rich in vitamin C and natural antioxidants',
        stockQuantity: 25
      },
      {
        name: 'Brownie Bites',
        description: 'Fudgy brownie bites with walnuts',
        price: 3.25,
        category: 'desserts' as const,
        ingredients: 'Dark chocolate, flour, eggs, butter, walnuts, cocoa powder',
        calories: 85,
        healthBenefits: 'Contains healthy fats from walnuts and antioxidants from dark chocolate',
        stockQuantity: 18
      }
    ];

    for (const item of sampleMenuItems) {
      try {
        await db.createMenuItem(item);
      } catch (error) {
        // Item might already exist, skip
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        users: sampleUsers.length,
        menuItems: sampleMenuItems.length,
        event: event?.name
      }
    });

  } catch (error) {
    console.error('Seed data error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create sample data' },
      { status: 500 }
    );
  }
}