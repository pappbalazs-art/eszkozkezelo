import type { Metadata, Viewport } from "next";
import { Rubik } from "next/font/google";
import { Providers } from "./providers";
import { Navbar } from "@/components/navbar";

import "@/styles/normalize.scss";
import "@/styles/globals.scss";
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

const rubik = Rubik({
	subsets: ["latin"],
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html>
			<body className={rubik.className}>
				<Providers>
					<Navbar />

					<main className="wrapper">{children}</main>
				</Providers>
			</body>
		</html>
	);
}
