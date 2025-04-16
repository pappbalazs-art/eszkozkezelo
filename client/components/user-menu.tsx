import { useRouter } from "next/navigation";

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";

import { useAuth } from "@/AuthContext";
import getInitialsFromName from "@/utils/get-initials";
import { NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";

export function UserMenu() {
	const { user, isAuthenticated } = useAuth();

	const router = useRouter();

	const handleSignOut = async () => {
		await signOut(auth);

		router.push("/");
	};

	const AdminMenuItems = () => (
		<DropdownMenu variant="flat">
			<DropdownItem key="reservations" href="/reservations">
				Foglalások
			</DropdownItem>
			<DropdownItem key="items" href="/items">
				Eszközök
			</DropdownItem>
			<DropdownItem key="categories" href="/categories">
				Kategóriák
			</DropdownItem>
			<DropdownItem key="users" href="/users">
				Felhasználók
			</DropdownItem>
			<DropdownItem key="settings" href="/settings">
				Beállítások
			</DropdownItem>
			<DropdownItem key="sign-out" color="danger">
				<Link color="danger" size="sm" onPress={handleSignOut}>
					Kijelentkezés
				</Link>
			</DropdownItem>
		</DropdownMenu>
	);

	const UserMenuItems = () => (
		<DropdownMenu variant="flat">
			<DropdownItem key="items" href="/items">
				Eszközök
			</DropdownItem>
			<DropdownItem key="settings" href="/settings">
				Beállítások
			</DropdownItem>
			<DropdownItem key="sign-out" color="danger">
				<Link color="danger" size="sm" onPress={handleSignOut}>
					Kijelentkezés
				</Link>
			</DropdownItem>
		</DropdownMenu>
	);

	if (isAuthenticated) {
		return (
			<Dropdown placement="bottom-end">
				<DropdownTrigger>
					<Avatar as="button" name={getInitialsFromName(user.name)} />
				</DropdownTrigger>

				{user.role === "admin" && <AdminMenuItems />}
				{user.role === "user" && <UserMenuItems />}
			</Dropdown>
		);
	}

	return (
		<>
			<NavbarItem>
				<Link color="foreground" href="sign-up">
					Regisztráció
				</Link>
			</NavbarItem>
			<NavbarItem>
				<Button as={Link} color="primary" variant="flat" href="sign-in">
					Bejelentkezés
				</Button>
			</NavbarItem>
		</>
	);
}
