import { type NextRequest, NextResponse } from "next/server";
import { routes } from "@/core/config/routes";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	const sessionToken = request.cookies.get("next-auth.session-token")?.value;

	if (!sessionToken) {
		return NextResponse.redirect(new URL(routes.login(), request.url));
	}

	try {
		const secretString = process.env.NEXTAUTH_SECRET!;
		const encodedKey = new TextEncoder().encode(secretString);

		const { payload } = await jwtVerify(sessionToken, encodedKey, {
			algorithms: ["HS256"],
		});

		if (payload.exp && payload.exp < Date.now() / 1000) {
			return NextResponse.redirect(new URL(routes.login(), request.url));
		}

		return NextResponse.next();
	} catch (error) {
		console.error("JWT verification failed:", error);
		return NextResponse.redirect(new URL(routes.login(), request.url));
	}
}

export const config = {
	matcher: ["/profile/:path*", "/chats/:path*"],
};
