"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/providers/auth-context";
import NavbarWrapper from "./navbar-wrapper";
import NavbarContainer from "./navbar-container";
import NavbarBrand from "./navbar-brand";
import NavbarLink from "./navbar-link";
import NavbarToggle from "./navbar-toggle";

import NoAuthNavbarContent from "./navbar-contents/no-auth-navbar-content";
import AdminNavbarContent from "./navbar-contents/admin-navbar-content";

type NavbarContextType = {
	isMenuOpen: boolean;
	toggleMenu(): void;
	closeMenu(): void;
};

export const NavbarContext = createContext<NavbarContextType>(
	{} as NavbarContextType
);

export default function Navbar(): ReactNode {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const { user, isAuthenticated } = useAuth();

	const toggleMenu = (): void => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = (): void => {
		setIsMenuOpen(false);
	};

	useEffect(() => {
		const handleResize = (): void => {
			setIsMenuOpen(false);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	const getNavbarContent = (): ReactNode => {
		if (isAuthenticated) {
			if (user?.role === "admin") {
				return <AdminNavbarContent />;
			}
		}

		return <NoAuthNavbarContent />;
	};

	return (
		<NavbarContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
			<NavbarWrapper>
				<NavbarContainer>
					<NavbarBrand>
						<NavbarLink href="/">EKKE-MKI</NavbarLink>
					</NavbarBrand>

					{getNavbarContent()}

					<NavbarToggle />
				</NavbarContainer>
			</NavbarWrapper>
		</NavbarContext.Provider>
	);
}
