import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/services/Connection";
import AdminModel from "@/services/schema/Admin";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        // Connect to database
        await connectToDatabase();
        
        try {
          // Find admin by username
          const admin = await AdminModel.findOne({ username: credentials.username });
          
          // If no admin found or password doesn't match
          if (!admin) return null;
          
          // Verify password
          const isValid = await admin.comparePassword(credentials.password);
          
          if (!isValid) return null;
          
          // Return admin info for the session
          return {
            id: admin._id.toString(),
            name: admin.username,
            email: admin.email,
            role: admin.role
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async redirect({url, baseUrl}) {
      return url.startsWith(baseUrl) ? url : `${baseUrl}/admin`;
    },
    async session({session, token}) {
      if (token && session.user) {
        // Make sure we're adding the user id from the token's sub field
        session.user.id = token.sub;
        // Add the user's role from the token
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({token, user}) {
      // Add user details to the token when it's first created
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    }
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  }
};
