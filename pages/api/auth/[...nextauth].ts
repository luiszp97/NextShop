import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "@/database";

interface UserToken {
    name?: string;
    email?: string;
    role?: string;
}

export const authOptions: NextAuthOptions = {
    // Configure one or more authentication providers

    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        // ...add more providers here
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Correo', type: 'email', placeholder: 'example@example.com' },
                password: { label: 'Contrasena', type: 'password', placeholder: '********' },
            },
            async authorize(credentials, req) {

                const user = await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);

                if (user) {
                    return {
                        ...user,
                        id: user._id
                    };
                }

                return null;
            }
        })
    ],

    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },

    session: {
        maxAge: 86400,
        strategy: 'jwt',
        updateAge: 86400
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account) {
                token.accsessToken = account.access_token;
                switch (account.type) {
                    case 'credentials':

                        token.user = user;
                        break;

                    case 'oauth':
                        token.user = await dbUsers.oAuthToDbUser(user.email || '', user.name || '');
                        break;

                    default:
                        break;
                }
            }
            return token;
        },

        async session({ session, token, user }) {

            session.accessToken = token.accsessToken as string;
            session.user = token.user as UserToken;

            return session;
        }
    }


};

export default NextAuth(authOptions);