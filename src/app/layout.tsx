import type { Metadata } from "next";
import { manrope } from "@/core/assets/fonts";
import "../core/styles/globals.css";
import React, { Suspense } from "react";
import Loading from "@/shared/components/Loading/Loading";
import { AllProviders } from "@/core/providers/AllProviders";
import Header from "@/widgets/Header/Header";
import { Toaster } from "sonner";

export const metadata: Metadata = {
	title: "Coder",
	description: "description",
	creator: "Andas.S",
	generator: "Next.js",
	// icons: {
	// 	icon: "/logo.svg",
	// 	shortcut: "/logo.svg",
	// 	apple: "/logo.svg",
	// },
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
						<Header />
						{children}
						<Toaster />
					</AllProviders>
				</Suspense>
			</body>
		</html>
	);
}
