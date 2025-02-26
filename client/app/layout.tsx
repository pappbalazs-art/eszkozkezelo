"use client";

import "@/styles/globals.css";
import { Link } from "@heroui/link";
import clsx from "clsx";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html suppressHydrationWarning lang="en">
			<head />
			<body
				className={clsx(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable
				)}
			>
				<Providers
					themeProps={{ attribute: "class", defaultTheme: "dark" }}
				>
					<div className="relative flex flex-col h-screen">
						<Navbar />
						<main
							className={clsx(
								"container mx-auto max-w-7xl p-16 px-6 flex-grow"
							)}
						>
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
