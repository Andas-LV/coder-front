export const formatDate = (dateInput: string | Date): string => {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

	if (isNaN(date.getTime())) {
		return "Недействительная дата";
	}

	return new Intl.DateTimeFormat("ru-RU", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

export const formatTimeOnly = (dateInput: string | Date): string => {
	const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

	if (isNaN(date.getTime())) {
		return "Недействительная дата";
	}

	const time = new Intl.DateTimeFormat("ru-RU", {
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);

	return `${time}`;
};
