import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { CameraIcon, UserIcon } from "./icons";

export default function Sidebar() {
	return (
		<Card
			className="fixed w-[200px] h-full p-[25px] pt-[90px]"
			shadow="sm"
			radius="none"
		>
			<Button
				className="w-full justify-start font-semibold"
				as={Link}
				variant="light"
				href="/items"
			>
				Eszközök
			</Button>
			<Button
				className="w-full justify-start font-semibold"
				as={Link}
				variant="light"
				href="/categories"
			>
				Kategóriák
			</Button>
			<Button
				className="w-full justify-start font-semibold"
				as={Link}
				variant="light"
				href="/users"
			>
				Felhasználók
			</Button>
		</Card>
	);
}
