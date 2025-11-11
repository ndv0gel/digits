/* eslint-disable arrow-body-style */
import { verify } from 'argon2'; // Using argon2
import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@lib/prisma';

const authOptions: NextAuthOptions = { // Named export
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'john@foo.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // console.log('Attempting to authorize user...'); // Debugging log
        // console.log('Credentials provided:', credentials); // Debugging log

        if (!credentials?.email || !credentials.password) {
          // console.log('Missing email or password credentials.'); // Debugging log
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          // console.log(`User not found for email: ${credentials.email}`); // Debugging log
          return null;
        }

        // console.log('User found:', user.email); // Debugging log

        const isPasswordValid = await verify(user.password, credentials.password); // Using argon2.verify

        // console.log('Is password valid?', isPasswordValid); // Debugging log

        if (!isPasswordValid) {
          // console.log('Invalid password.'); // Debugging log
          return null;
        }

        // console.log('Authorization successful for user:', user.email); // Debugging log
        return {
          id: `${user.id}`,
          email: user.email,
          randomKey: user.role,
        };
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    //   error: '/auth/error',
    //   verifyRequest: '/auth/verify-request',
    //   newUser: '/auth/new-user'
  },
  callbacks: {
    session: ({ session, token }) => {
      // console.log('Session Callback', { session, token })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }) => {
      // console.log('JWT Callback', { token, user })
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions; // Named export
