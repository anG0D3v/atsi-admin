import NextAuth from 'next-auth/next';
import auth from './auth';
const handler = NextAuth(auth);

export { handler as GET, handler as POST };
