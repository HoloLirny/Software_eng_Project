import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../../../../../prisma/prisma";
import bcrypt from "bcrypt";

export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            throw new Error("No user found with the provided email.");
          }

          const isPasswordValid = bcrypt.compareSync(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password.");
          }

          return user;
        } catch (error) {
          console.error("Authorize error:", error.message);
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.user_name = user.user_name;
        token.email = user.email;
        token.role = user.user_role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id,
        user_name: token.user_name,
        email: token.email,
        role: token.role,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
