import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from './db';

// Custom adapter for MySQL
export const mysqlAdapter = {
  // Create user (for sign up if needed)
  async createUser(data: any) {
    const userId = await db.insert(
      `INSERT INTO app_admin (admin_email, fullname, password, admin_phone) 
       VALUES (?, ?, ?, ?)`,
      [data.email, data.name, data.password, data.phone]
    );
    
    const user = await db.queryOne<{
      admin_phone: any;
      fullname: string;
      admin_email: string;
      admin_id: string;
      dash_id: any;
      created_at: Date;
    }>(
      'SELECT admin_id, admin_email, dash_id, fullname, admin_phone FROM app_admin WHERE admin_id = ?',
      [userId]
    );
    
    return {
      id: user!.admin_id,
      email: user!.admin_email,
      name: user!.fullname,
      dash_id: user!.dash_id,
      phone: user!.admin_phone,
      emailVerified: null,
    };
  },
  
  // Get user by ID
  async getUser(id: string) {
    const user = await db.queryOne<{
      admin_id: any;
      admin_phone: any;
       fullname: any;
      dash_id: any;
      admin_email: any;
       password: string;
      created_at: Date;
    }>(
      'SELECT admin_id, admin_email, fullname, admin_phone, dash_id, password FROM app_admin WHERE admin_id = ?',
      [parseInt(id)]
    );
    
    if (!user) return null;
    
    return {
      id: user.admin_id.toString(),
      email: user.admin_email,
      name: user.fullname,
      dash_id: user.dash_id,
      phone: user.admin_phone,
      emailVerified: null,
    };
  },
  
  // Get user by email
  async getUserByEmail(email: string) {
    const user = await db.queryOne<{
      dash_id: any;
       admin_id: any;
      admin_phone: any;
      fullname: any;
      admin_email: any;
      password: string;
      created_at: Date;
    }>(
      'SELECT admin_id, admin_email, fullname, admin_phone, dash_id, password FROM app_admin WHERE admin_email = ?',
      [email]
    );
    
    if (!user) return null;
    
    return {
      id: user.admin_id,
      email: user.admin_email,
      name: user.fullname,
      phone: user.admin_phone,
      dash_id: user.dash_id,
      emailVerified: null,
    };
  },
  
  // Get user by account (for OAuth providers)
  async getUserByAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }) {
    const account = await db.queryOne<{
      user_id: number;
    }>(
      `SELECT user_id FROM accounts 
       WHERE provider = ? AND provider_account_id = ?`,
      [provider, providerAccountId]
    );
    
    if (!account) return null;
    
    return this.getUser(account.user_id.toString());
  },
  
  // Update user
  async updateUser(data: { id: string; email?: string; name?: string; phone?: string }) {
    const updates = [];
    const params = [];
    
    if (data.email) {
      updates.push('admin_email = ?');
      params.push(data.email);
    }
    
    if (data.name) {
      updates.push('admin_fullname = ?');
      params.push(data.name);
    }
    
    if (data.phone) {
      updates.push('admin_phone = ?');
      params.push(data.phone);
    }
    
    if (updates.length > 0) {
      params.push(parseInt(data.id));
      
      await db.update(
        `UPDATE dashboard_admin SET ${updates.join(', ')}, updated_at = NOW() WHERE dadmin_id = ?`,
        params
      );
    }
    
    return this.getUser(data.id);
  },
  
  // Link account (for OAuth)
  async linkAccount(data: any) {
    await db.insert(
      `INSERT INTO accounts (
        user_id, provider, provider_account_id, 
        access_token, refresh_token, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        parseInt(data.userId),
        data.provider,
        data.providerAccountId,
        data.access_token,
        data.refresh_token,
        data.expires_at,
      ]
    );
    
    return data;
  },
  
  // Create session
  async createSession(data: any) {
    const sessionId = await db.insert(
      `INSERT INTO sessions (user_id, expires, session_token) 
       VALUES (?, ?, ?)`,
      [
        parseInt(data.userId),
        data.expires,
        data.sessionToken,
      ]
    );
    
    const session = await db.queryOne<{
      id: number;
      user_id: number;
      expires: Date;
      session_token: string;
    }>(
      'SELECT id, user_id, expires, session_token FROM sessions WHERE id = ?',
      [sessionId]
    );
    
    return {
      id: session!.id.toString(),
      userId: session!.user_id.toString(),
      expires: session!.expires,
      sessionToken: session!.session_token,
    };
  },
  
  // Get session and user
  async getSessionAndUser(sessionToken: string) {
    const session = await db.queryOne<{
      id: number;
      user_id: number;
      expires: Date;
      session_token: string;
    }>(
      'SELECT id, user_id, expires, session_token FROM sessions WHERE session_token = ?',
      [sessionToken]
    );
    
    if (!session) return null;
    
    const user = await this.getUser(session.user_id.toString());
    if (!user) return null;
    
    return {
      session: {
        id: session.id.toString(),
        userId: session.user_id.toString(),
        expires: session.expires,
        sessionToken: session.session_token,
      },
      user,
    };
  },
  
  // Update session
  async updateSession(data: { sessionToken: string; expires: Date }) {
    const result = await db.update(
      'UPDATE sessions SET expires = ? WHERE session_token = ?',
      [data.expires, data.sessionToken]
    );
    
    if (result === 0) return null;
    
    const session = await db.queryOne<{
      id: number;
      user_id: number;
      expires: Date;
      session_token: string;
    }>(
      'SELECT id, user_id, expires, session_token FROM sessions WHERE session_token = ?',
      [data.sessionToken]
    );
    
    return {
      id: session!.id.toString(),
      userId: session!.user_id.toString(),
      expires: session!.expires,
      sessionToken: session!.session_token,
    };
  },
  
  // Delete session
  async deleteSession(sessionToken: string) {
    await db.delete(
      'DELETE FROM sessions WHERE session_token = ?',
      [sessionToken]
    );
  },
};

// Main auth options configuration
export const authOptions: NextAuthOptions = {
  // Use our custom MySQL adapter
  adapter: mysqlAdapter as any,
callbacks: {
  async jwt({ token, user, account, profile }) {
    console.log("JWT Callback - User object:", user); // Debug
    console.log("JWT Callback - User dash_id:", user?.dash_id); // Debug
    
    if (user) {
      const newToken = {
        ...token,
        id: user.id,
        phone: (user as any).phone,
        dash_id: (user as any).dash_id, // Add dash_id here
        email: user.email,
      };
      
      console.log("JWT Callback - New token:", newToken); // Debug
      return newToken;
    }
    
    console.log("JWT Callback - Existing token:", token); // Debug
    return token;
  },
  
  async session({ session, token, user }) {
    console.log("Session Callback - Token:", token); // Debug
    console.log("Session Callback - Token dash_id:", token.dash_id); // Debug
    console.log("Session Callback - User:", user); // Debug
    
    const newSession = {
      ...session,
      user: {
        ...session.user,
        id: token.id,
        phone: token.phone,
        dash_id: token.dash_id, // Add dash_id to session
        email: token.email,
      }
    };
    
    console.log("Session Callback - New session:", newSession); // Debug
    
    return newSession;
  },
},
  
  pages: {
    signIn: '/auth/sign-in',
    error: '/auth/error',
    signOut: '/',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/sign-up',
  },
  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { 
          label: "Email", 
          placeholder: "jsmith@gmail.com", 
          type: "email" 
        },
        password: { 
          label: "Password", 
          type: "password" 
        }
      },
      
// Update the authorize function with more debugging
async authorize(credentials) {
  if (!credentials?.email || !credentials.password) {
    throw new Error('Please enter both email and password');
  }
  
  try {
    // Find user by email
    const existingUser = await db.queryOne<{
      dash_id: any;
      admin_id: number;
      admin_email: string;
      fullname: string;
      admin_phone: string | null;
      password: string;
    }>(
      `SELECT admin_id, admin_email, fullname, admin_phone, dash_id, password
       FROM app_admin WHERE admin_email = ?`,
      [credentials.email.trim().toLowerCase()]
    );
    
    if (!existingUser) {
      throw new Error('Invalid email or password');
    }
    
    console.log("User found in DB:", {
      id: existingUser.admin_id,
      email: existingUser.admin_email,
      dash_id: existingUser.dash_id, // Debug: check dash_id from DB
      dash_id_type: typeof existingUser.dash_id,
    });
    
    console.log("Stored PHP hash:", existingUser.password);
    console.log("Provided password:", credentials.password);
    
    // Convert PHP's $2y$ prefix to $2b$ for Node.js bcrypt
    const convertPHPHash = (phpHash: string): string => {
      if (phpHash.startsWith('$2y$')) {
        return '$2b$' + phpHash.substring(4);
      }
      return phpHash;
    };
    
    const nodejsHash = convertPHPHash(existingUser.password);
    console.log("Converted hash for bcrypt:", nodejsHash);
    
    // Verify password with converted hash
    const passwordMatch = await compare(credentials.password, nodejsHash);
    
    console.log("Password match result:", passwordMatch);
    
    if (!passwordMatch) {
      // Try one more time with the original hash
      const passwordMatchOriginal = await compare(credentials.password, existingUser.password);
      console.log("Password match with original hash:", passwordMatchOriginal);
      
      if (!passwordMatchOriginal) {
        throw new Error('Invalid email or password');
      }
    }
    
    // Debug: Log what we're returning
    const userToReturn = {
      id: existingUser.admin_id.toString(),
      email: existingUser.admin_email,
      name: existingUser.fullname,
      dash_id: existingUser.dash_id, // Include dash_id here
      phone: existingUser.admin_phone,
    };
    
    console.log("Returning user object:", userToReturn);
    
    return userToReturn;
    
  } catch (error) {
    console.error('Auth error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Authentication failed');
  }
}
    })
  ],
  
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  debug: process.env.NODE_ENV === 'development',
};

// Type declarations for TypeScript
declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    dash_id?: any; // Add dash_id to User type
  }
  
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      phone?: string;
      dash_id?: any; // Add dash_id to Session type
    }
  }
  
  interface JWT {
    id: string;
    email: string;
    phone?: string;
    dash_id?: any; // Add dash_id to JWT type
  }
}

// Extended auth options with more providers
export const extendedAuthOptions: NextAuthOptions = {
  ...authOptions,
  providers: [
    ...authOptions.providers,
    // Add more providers here if needed
  ]
};