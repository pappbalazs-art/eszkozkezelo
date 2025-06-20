export default function getArticleForWord(word: string): string {
	if (!word) {
		return "";
	}

	const vowels = [
		"a",
		"á",
		"e",
		"é",
		"i",
		"í",
		"o",
		"ó",
		"ö",
		"ő",
		"u",
		"ú",
		"ü",
		"ű",
	];
	const firstChar = word.toLowerCase().substring(0, 1);

	return vowels.includes(firstChar) ? "az" : "a";
}
