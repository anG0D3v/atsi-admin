import { STATUS_CODES } from '@/config/utils/constants';
import { UserServices } from '../../../services';
import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

var userInfo: any;

const auth: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'username', type: 'text' },
        password: { label: 'password', type: 'password' },
      },

      async authorize(credentials) {
        try {
          const response = await UserServices.login({
            username: credentials.username,
            password: credentials.password,
          });

          // Check the response and return user data or null based on your logic
          if (response.status === STATUS_CODES.OK) {
            if ('message' in response.data) {
              return response?.data?.message;
            } else {
              console.log('response data: ', response?.data?.data);
              userInfo = response?.data?.data;
              return response?.data?.data;
            }
          }
          return null;
        } catch (error) {
          // Handle any Axios errors here
          console.error('Axios error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return typeof user !== 'string';
    },
    async session({ session, user, token }) {
      let body = Object.assign(session.user, { ...userInfo });
      return typeof userInfo !== 'undefined' ? body : {};
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default auth;
