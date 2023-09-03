import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import upstashRedisClient from "@upstash/redis";

//const redis = upstashRedisClient(
//  process.env.UPSTASH_REDIS_URL,
//  process.env.UPSTASH_REDIS_TOKEN
//);

//setup redis adapter to start saving user data
export const authOptions: NextAuthOptions = {
  //adapter: UpstashRedisAdapter(redis),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    })
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: '/signin'
  },
  callbacks: { },
  events: { },
};
