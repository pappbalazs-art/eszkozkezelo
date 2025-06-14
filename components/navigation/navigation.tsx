"use client";

import { ReactNode } from "react";

import { Navbar } from "../navbar";
import { Sidebar } from "../sidebar";

import { useAuth } from "@/providers/auth-context";

import "./navigation.scss";

export default function Navigation(): ReactNode {
	const { user, isAuthenticated } = useAuth();

	return (
		<>
			<Navbar />
			{isAuthenticated && user?.role === "admin" && (
				<>
					<Sidebar />
				</>
			)}
		</>
	);
}
