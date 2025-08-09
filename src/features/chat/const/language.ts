export const LANGUAGES = [
	{ value: "javascript", label: "JavaScript", color: "#f7df1e" }, // жёлтый JS
	{ value: "typescript", label: "TypeScript", color: "#3178c6" }, // синий TS
	{ value: "python", label: "Python", color: "#3776ab" }, // синий питон
	{ value: "java", label: "Java", color: "#b07219" }, // коричнево-оранжевый Java
	{ value: "cpp", label: "C++", color: "#00599c" }, // синий C++
	{ value: "css", label: "CSS", color: "#264de4" }, // синий CSS
	{ value: "html", label: "HTML", color: "#e34c26" }, // оранжевый HTML
	{ value: "json", label: "JSON", color: "#cb3837" }, // красный npm/JSON
	{ value: "sql", label: "SQL", color: "#e38c00" }, // золотистый SQL
	{ value: "bash", label: "Bash", color: "#3e474a" }, // тёмно-серый Bash
];

export function getLanguageColor(
	value: string | undefined,
): string | undefined {
	const lang = LANGUAGES.find((l) => l.value === value);
	return lang?.color;
}
