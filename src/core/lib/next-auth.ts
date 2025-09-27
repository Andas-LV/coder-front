import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth";
import axiosInstance from "@/shared/api/axiosInstance";
import { routes } from "@/core/config/routes";
import { jwtVerify, SignJWT } from "jose";

export const authOptions: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
		CredentialsProvider({
			id: "credentials",
			name: "QR Login",
			credentials: {
				userData: { label: "User Data", type: "text" },
			},
			async authorize(credentials, req) {
				console.log("[v0] Credentials authorize called:", credentials)

				if (!credentials?.userData) {
					console.log("[v0] No userData provided")
					return null
				}

				try {
					const userData = JSON.parse(credentials.userData)
					console.log("[v0] Parsed userData:", userData)

					if (userData && userData.type === "login" && userData.user) {
						const user = userData.user
						return {
							id: user.id,
							email: user.email,
							name: user.name,
							image: user.image,
							provider: user.provider,
							providerId: user.providerId,
						}
					}
				} catch (error) {
					console.error("[v0] Error parsing userData:", error)
				}

				return null
			},
		}),
	],
	jwt: {
		async encode({ token, secret }) {
			const secretString =
				typeof secret === "string" ? secret : secret.toString("utf-8");
			const encodedKey = new TextEncoder().encode(secretString);
			return new SignJWT(token)
				.setProtectedHeader({ alg: "HS256" })
				.setIssuedAt()
				.setExpirationTime("30d")
				.sign(encodedKey);
		},
		async decode({ token, secret }) {
			const secretString =
				typeof secret === "string" ? secret : secret.toString("utf-8");
			const encodedKey = new TextEncoder().encode(secretString);
			const { payload } = await jwtVerify(token!, encodedKey, {
				algorithms: ["HS256"],
			});
			return payload;
		},
	},
	cookies: {
		sessionToken: {
			name: "next-auth.session-token",
			options: {
				httpOnly: false,
				sameSite: "lax",
				path: "/",
				secure: process.env.NODE_ENV === "production",
			},
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			try {
				const payload = {
					id: user.id,
					email: user.email,
					name: user.name,
					image: user.image,
					provider: account?.provider,
					providerId: account?.providerAccountId,
				};

				await axiosInstance.post("/users/sync", payload);
			} catch (error) {
				console.error("Error syncing user with backend:", error);
				return false;
			}
			return true;
		},
		async jwt({ token, user, account }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.image = user.image;
			}
			if (account) {
				token.provider = account.provider;
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.email = token.email;
				session.user.name = token.name;
				session.user.image = token.image;
				session.provider = token.provider;
				session.accessToken = token.accessToken;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: routes.login(),
		error: routes.login(),
	},
	session: {
		strategy: "jwt",
	},
	debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export default handler;
