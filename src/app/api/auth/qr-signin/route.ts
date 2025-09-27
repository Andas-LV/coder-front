import { type NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

export async function POST(request: NextRequest) {
	try {
		const { user } = await request.json()

		if (!user) {
			return NextResponse.json({ error: "Invalid user data" }, { status: 400 })
		}

		const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)

		const token = await new SignJWT({
			id: user.id,
			email: user.email,
			name: user.name,
			image: user.image,
			provider: "qr-login",
		})
			.setProtectedHeader({ alg: "HS256" })
			.setIssuedAt()
			.setExpirationTime("30d")
			.sign(secret)

		const response = NextResponse.json({
			success: true,
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				image: user.image,
			},
		})

		response.cookies.set("next-auth.session-token", token, {
			httpOnly: false,
			sameSite: "lax",
			path: "/",
			secure: process.env.NODE_ENV === "production",
			maxAge: 30 * 24 * 60 * 60, // 30 days
		})

		return response
	} catch (error) {
		console.error("QR signin error:", error)
		return NextResponse.json({ error: "Internal server error" }, { status: 500 })
	}
}
