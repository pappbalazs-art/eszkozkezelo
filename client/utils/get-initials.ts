export default function getInitialsFromName(name: string): string {
	return name
		.split(" ")
		.map((word) => word.split("")[0])
		.join("");
}
