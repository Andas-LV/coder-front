import type { Metadata } from "next";
import { manrope } from "@/core/assets/fonts";
import "../core/styles/globals.css";
import React, { Suspense } from "react";
import Loading from "@/shared/components/Loading/Loading";
import { AllProviders } from "@/core/providers/AllProviders";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Coder",
	description: "description",
	creator: "Andas.S",
	generator: "Next.js",
	icons: {
		icon: "/logo.png",
		shortcut: "/logo.png",
		apple: "/logo.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${manrope.className}`}>
				<Suspense fallback={<Loading />}>
					<AllProviders>
						{children}
						<Toaster />
					</AllProviders>
				</Suspense>
			</body>
		</html>
	);
}
