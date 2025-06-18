import { useAuth } from "@/providers/auth-context";

export default function getInitialsFromCurrentUserName(): string {
	const { user } = useAuth();

	if (!user) {
		return "";
	}

	const names = user.name.split(" ");
	const initialsArray = names.map((name: string, index: number): string => {
		if (index > 1) {
			return "";
		}

		return name.substring(0, 1);
	});
	const initials = initialsArray.join("");

	return initials;
}
