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

export function UserMenu() {
	const { user } = useAuth();

	const router = useRouter();

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

	return (
		<Dropdown placement="bottom-end">
			<DropdownTrigger>
				<Avatar as="button" name={getInitialsFromName(user.name)} />
			</DropdownTrigger>
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
				<DropdownItem
					key="sign-out"
					color="danger"
					onPress={(e) => handleSignOut()}
				>
					<Link color="danger" size="sm">
						Kijelentkezés
					</Link>
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
}
