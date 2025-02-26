"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";

import {
	Navbar as NavbarUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Logo } from "./icons";
import { useAuth } from "@/AuthContext";
import { auth } from "@/firebase";

import { UserMenu } from "./user-menu";

export function Navbar() {
	const { user } = useAuth();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const router = useRouter();

	const isAuthenticated = () => {
		return !!user;
	};

	const getUserRole = () => {
		return user.role;
	};

	const handleSignOut = () => {
		signOut(auth)
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
			})
			.finally(() => {
				router.push("/");
			});
	};

	const NavbarItems = () => {
		if (isAuthenticated() && getUserRole() === "user") {
			return (
				<NavbarContent className="hidden sm:flex gap-4" justify="end">
					<NavbarItem>
						<Link color="foreground" href="/settings">
							Beállítások
						</Link>
					</NavbarItem>
					<NavbarItem>
						<Link
							color="foreground"
							href="#"
							onClick={handleSignOut}
						>
							Kilépés
						</Link>
					</NavbarItem>
				</NavbarContent>
			);
		}

		if (isAuthenticated() && getUserRole() === "admin") {
			return (
				<NavbarContent className="hidden sm:flex gap-4" justify="end">
					<UserMenu />
				</NavbarContent>
			);
		}

		return (
			<NavbarContent className="hidden sm:flex gap-4" justify="end">
				<NavbarItem>
					<Link color="foreground" href="/sign-up">
						Regisztráció
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Button
						as={Link}
						color="primary"
						variant="flat"
						href="/sign-in"
					>
						Bejelentkezés
					</Button>
				</NavbarItem>
			</NavbarContent>
		);
	};

	const NavbarMenuItems = () => {
		if (isAuthenticated() && getUserRole() === "user") {
			return (
				<NavbarMenu>
					<NavbarMenuItem>
						<Link
							className="w-full"
							color="foreground"
							size="lg"
							href="/settings"
						>
							Beállítások
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							className="w-full"
							color="foreground"
							size="lg"
							href="#"
							onClick={handleSignOut}
						>
							Kilépés
						</Link>
					</NavbarMenuItem>
				</NavbarMenu>
			);
		}

		if (isAuthenticated() && getUserRole() === "admin") {
			return (
				<NavbarMenu>
					<NavbarMenuItem>
						<Link
							className="w-full"
							color="foreground"
							size="lg"
							href="/items"
						>
							Eszközök
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							className="w-full"
							color="foreground"
							size="lg"
							href="/users"
						>
							Felhasználók
						</Link>
					</NavbarMenuItem>
					<NavbarMenuItem>
						<Link
							className="w-full"
							color="foreground"
							size="lg"
							href="#"
							onClick={handleSignOut}
						>
							Kilépés
						</Link>
					</NavbarMenuItem>
				</NavbarMenu>
			);
		}

		return (
			<NavbarMenu>
				<NavbarItem>
					<Link
						className="w-full"
						color="foreground"
						size="lg"
						href="/sign-up"
					>
						Regisztráció
					</Link>
				</NavbarItem>
				<NavbarItem>
					<Link
						className="w-full"
						color="foreground"
						size="lg"
						href="/sign-in"
					>
						Bejelentkezés
					</Link>
				</NavbarItem>
			</NavbarMenu>
		);
	};

	return (
		<NavbarUINavbar
			isBordered
			isMenuOpen={isMenuOpen}
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarBrand>
				<Link color="foreground" href="/">
					<Logo />
					<p className="font-bold text-inherit">EKKE-MI</p>
				</Link>
			</NavbarBrand>

			<NavbarItems />

			<NavbarMenuToggle
				className="sm:hidden"
				aria-label={isMenuOpen ? "Menü bezárása" : "Menü kinyitása"}
			/>

			<NavbarMenuItems />
		</NavbarUINavbar>
	);
}
