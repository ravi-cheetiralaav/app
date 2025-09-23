import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import DataAccessLayer from '@/lib/database/dal';
import { User } from '@/lib/types';

const dal = new DataAccessLayer();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'customer',
      name: 'Customer Login',
      credentials: {
        user_id: { label: 'User ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.user_id) {
          return null;
        }

        try {
          // Find customer (non-admin) user by user_id
          const user = await dal.getUserByCredentials(credentials.user_id, false);
          
          if (user && user.is_active) {
            return {
              id: user.user_id,
              name: `${user.first_name} ${user.last_name}`,
              email: user.user_id, // Using user_id as email for NextAuth compatibility
              image: null,
              user_id: user.user_id,
              greeting_word: user.greeting_word,
              is_admin: false,
            };
          }
        } catch (error) {
          console.error('Customer authentication error:', error);
        }

        return null;
      },
    }),
    CredentialsProvider({
      id: 'admin',
      name: 'Admin Login',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Find admin user by user_id (username)
          const user = await dal.getUserByCredentials(credentials.username, true);
          
          if (user && user.is_admin && user.is_active) {
            // For now, we'll use a simple password check
            // In production, this should be properly hashed
            const isPasswordValid = user.password_hash 
              ? await bcrypt.compare(credentials.password, user.password_hash)
              : credentials.password === 'admin123'; // Default password for initial setup
            
            if (isPasswordValid) {
              return {
                id: user.user_id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.user_id,
                image: null,
                user_id: user.user_id,
                greeting_word: user.greeting_word,
                is_admin: true,
              };
            }
          }
        } catch (error) {
          console.error('Admin authentication error:', error);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = (user as any).user_id;
        token.greeting_word = (user as any).greeting_word;
        token.is_admin = (user as any).is_admin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user_id = token.user_id;
        (session as any).greeting_word = token.greeting_word;
        (session as any).is_admin = token.is_admin;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || 'terrace-kids-food-cart-secret-key',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };