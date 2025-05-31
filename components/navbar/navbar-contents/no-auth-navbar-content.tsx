import { ReactNode } from "react";
import NavbarContent from "../navbar-contet";
import NavbarItem from "../navbar-item";
import NavbarLink from "../navbar-link";
import NavbarMenu from "../navbar-menu";
import NavbarMenuItem from "../navbar-menu-item";
import NavbarMenuLink from "../navbar-menu-link";
import { Button } from "@/components/button";

export default function NoAuthNavbarContent(): ReactNode {
	return (
		<>
			<NavbarContent>
				<NavbarItem>
					<NavbarLink href="/sign-up">Regisztráció</NavbarLink>
				</NavbarItem>
				<NavbarItem>
					<NavbarLink href="/sign-in">
						<Button>Bejelentkezés</Button>
					</NavbarLink>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				<NavbarMenuItem>
					<NavbarMenuLink href="/sign-up">
						Regisztráció
					</NavbarMenuLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<NavbarMenuLink href="/sign-in" color="primary">
						Bejelentkezés
					</NavbarMenuLink>
				</NavbarMenuItem>
			</NavbarMenu>
		</>
	);
}
