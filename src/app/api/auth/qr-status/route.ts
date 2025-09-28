import { type NextRequest, NextResponse } from "next/server";

const authSessions = new Map<
	string,
	{ authenticated: boolean; user?: any; timestamp: number }
>();

// Очистка старых сессий (старше 10 минут)
const cleanupOldSessions = () => {
	const now = Date.now();
	const tenMinutes = 10 * 60 * 1000;

	for (const [sessionId, session] of authSessions.entries()) {
		if (now - session.timestamp > tenMinutes) {
			authSessions.delete(sessionId);
		}
	}
};

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const sessionId = searchParams.get("sessionId");

	if (!sessionId) {
		return NextResponse.json({ error: "Session ID required" }, { status: 400 });
	}

	cleanupOldSessions();

	const session = authSessions.get(sessionId);

	return NextResponse.json({
		authenticated: session?.authenticated || false,
		user: session?.user || null,
	});
}

export async function POST(request: NextRequest) {
	try {
		const { sessionId, user } = await request.json();

		if (!sessionId || !user) {
			return NextResponse.json(
				{ error: "Session ID and user required" },
				{ status: 400 },
			);
		}

		// Сохраняем статус авторизации
		authSessions.set(sessionId, {
			authenticated: true,
			user,
			timestamp: Date.now(),
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("QR status update error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
