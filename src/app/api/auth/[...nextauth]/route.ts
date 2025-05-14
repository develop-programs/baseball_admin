import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth(
    {
        secret: process.env.NEXT_AUTH_SECRET,
        providers: [
            CredentialsProvider({
                name: "Credentials",
                credentials: {
                    username: {label: "Username", type: "text", placeholder: "jsmith"},
                    password: {label: "Password", type: "password"}
                },
                async authorize(credentials) {
                    if (!credentials) return null
                    return null
                }
            })
        ],
        callbacks: {
            async redirect({baseUrl}) {
                return baseUrl
            },
            async session({session}) {
                return session
            },
            async jwt({token}) {
                return token
            }
        },
        pages: {}
    }
)

export {handler as GET, handler as POST}