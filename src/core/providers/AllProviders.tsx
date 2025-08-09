"use client";

import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { SessionProvider } from "next-auth/react";

export function AllProviders({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ThemeProvider>
			<SessionProvider>{children}</SessionProvider>
		</ThemeProvider>
	);
}
