import React from "react";
import Header from "@/widgets/Header/Header";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div>
			<Header />
			{children}
		</div>
	);
}
