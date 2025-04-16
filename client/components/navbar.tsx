"use client";

import {
	Navbar as NavbarUINavbar,
	NavbarContent,
	NavbarBrand,
} from "@heroui/navbar";
import { Link } from "@heroui/link";
import { Logo } from "./icons";

import { UserMenu } from "./user-menu";

export function Navbar() {
	return (
		<NavbarUINavbar isBordered>
			<NavbarBrand>
				<Link color="foreground" href="/">
					<Logo />
					<p className="font-bold text-inherit">EKKE-MI</p>
				</Link>
			</NavbarBrand>

			<NavbarContent className="hidden sm:flex gap-4" justify="end">
				<UserMenu />
			</NavbarContent>
		</NavbarUINavbar>
	);
}
