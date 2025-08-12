export const LANGUAGES = [
	{ value: "javascript", label: "JavaScript", color: "#f7df1e" },
	{ value: "typescript", label: "TypeScript", color: "#3178c6" },
	{ value: "html", label: "HTML", color: "#e34c26" },
	{ value: "css", label: "CSS", color: "#264de4" },
	{ value: "json", label: "JSON", color: "#cb3837" },
	{ value: "python", label: "Python", color: "#3776ab" },
	{ value: "java", label: "Java", color: "#b07219" },
	{ value: "cpp", label: "C++", color: "#00599c" },
	{ value: "csharp", label: "C#", color: "#178600" },
	{ value: "go", label: "Go", color: "#00ADD8" },
	{ value: "rust", label: "Rust", color: "#dea584" },
	{ value: "php", label: "PHP", color: "#777bb4" },
	{ value: "ruby", label: "Ruby", color: "#cc342d" },
	{ value: "swift", label: "Swift", color: "#f05138" },
	{ value: "kotlin", label: "Kotlin", color: "#A97BFF" },
	{ value: "dart", label: "Dart", color: "#0175C2" },
	{ value: "sql", label: "SQL", color: "#e38c00" },
	{ value: "bash", label: "Bash", color: "#3e474a" }
];

export function getLanguageColor(
	value: string | undefined,
): string | undefined {
	const lang = LANGUAGES.find((l) => l.value === value);
	return lang?.color;
}
