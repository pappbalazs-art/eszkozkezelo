import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Navigation } from "@/components/navigation";

import "@/styles/normalize.scss";
import "@/styles/globals.scss";
import "@/styles/animations.scss";
import "./layout.scss";

export const metadata: Metadata = {
	title: "Eszközkezelő",
	description: "",
	creator: "Papp Balázs",
	authors: [
		{
			name: "Papp Balázs",
		},
		{
			name: "Magyar Elemér",
		},
	],
	publisher: "Eszterházy Károly Katolikus Egyetem",
	keywords: "",
	robots: {
		index: true,
		follow: true,
	},
	other: {
		language: "hungarian",
	},
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	userScalable: false,
};

const inter = Inter({
	subsets: ["latin"],
	weight: ["500", "800"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html>
			<body className={inter.className}>
				<Providers>
					<Navigation />

					<main className="wrapper">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
