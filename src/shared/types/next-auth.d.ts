import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id?: string;
			email?: string;
			name?: string;
			image?: string;
		} & DefaultSession["user"];
		accessToken?: string;
		provider?: string;
	}

	interface User {
		id?: string;
		email?: string;
		name?: string;
		image?: string;
		accessToken?: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		email?: string;
		name?: string;
		image?: string;
		provider?: string;
		accessToken?: string;
	}
}
