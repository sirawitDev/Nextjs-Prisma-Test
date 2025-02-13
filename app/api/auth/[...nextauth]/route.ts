import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient()

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email', placeholder: 'john@doe.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                if (!credentials) return null
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: credentials.email },
                    })

                    if (user && (await bcrypt.compare(credentials.password, user.password))) {
                        return {
                            id: user.id.toString(),
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    } else {
                        throw new Error('Invalid email or password')
                    }
                } catch (error) {
                    console.error(error)
                    throw new Error('Authentication error')
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            console.log('JWT Callback:', token, user);
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token;
        },
        session: async ({ session, token }) => {
            console.log('Session Callback:', session, token);
            if (session.user && token.id) {
                session.user.id = token.id
                session.user.role = token.role
            }
            return session;
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }