import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password" }
        },
      async authorize(credentials) {
        if(!credentials?.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if(!user) {
          return null;
        }
        if (credentials.password && user.hashedPassword) {
          const passwordsMatch = await bcrypt.compare(credentials.password, user.hashedPassword);
          if (!passwordsMatch) {
            return null;
          }
        } else {
          return null;
        }

        return user;
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
        signIn: '/signin'
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }