import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import NavbarMenu from "../navbar-menu";
import NavbarMenuItem from "../navbar-menu-item";
import NavbarMenuLink from "../navbar-menu-link";
import NavbarContent from "../navbar-contet";
import NavbarItem from "../navbar-item";
import { Avatar } from "@/components/avatar";
import {
	Dropdown,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLink,
	DropdownTrigger,
} from "@/components/dropdown";
import getInitialsFromCurrentUserName from "@/utils/get-initials-from-current-user-name";
import { SettingsIcon, SignOutIcon } from "@/components/icons";

export default function AdminNavbarContent(): ReactNode {
	const router = useRouter();

	const handleSignOut = async (): Promise<void> => {
		await signOut(auth);
		router.push("/");
	};

	return (
		<>
			<NavbarContent>
				<NavbarItem>
					<Dropdown>
						<DropdownTrigger>
							<Avatar
								initials={getInitialsFromCurrentUserName()}
							/>
						</DropdownTrigger>

						<DropdownMenu>
							<DropdownMenuItem>
								<DropdownMenuLink
									href="/settings"
									icon={<SettingsIcon />}
								>
									Beállítások
								</DropdownMenuLink>
							</DropdownMenuItem>
							<DropdownMenuItem
								color="danger"
								onClick={handleSignOut}
							>
								<DropdownMenuLink
									href=""
									icon={<SignOutIcon />}
								>
									Kijelentkezés
								</DropdownMenuLink>
							</DropdownMenuItem>
						</DropdownMenu>
					</Dropdown>
				</NavbarItem>
			</NavbarContent>

			<NavbarMenu>
				<NavbarMenuItem>
					<NavbarMenuLink href="/">Kezdőlap</NavbarMenuLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<NavbarMenuLink href="/categories">
						Kategóriák
					</NavbarMenuLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<NavbarMenuLink href="/items">Eszközök</NavbarMenuLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<NavbarMenuLink href="/reservations">
						Foglalások
					</NavbarMenuLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<NavbarMenuLink href="/settings">
						Beállítások
					</NavbarMenuLink>
				</NavbarMenuItem>
				<NavbarMenuItem>
					<NavbarMenuLink href="/" color="danger">
						Kijelentkezés
					</NavbarMenuLink>
				</NavbarMenuItem>
			</NavbarMenu>
		</>
	);
}
