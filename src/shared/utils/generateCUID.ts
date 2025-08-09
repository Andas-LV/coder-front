let cuidCounter = 0;
const pad = (num: string, size = 2) => num.padStart(size, "0");

function randomBlock(length = 4): string {
	// случайные байты в base36
	let str = "";
	for (let i = 0; i < length; i++) {
		str += Math.floor(Math.random() * 36).toString(36);
	}
	return str;
}

export function generateCUID(): string {
	const timestamp = Date.now().toString(36);
	cuidCounter = (cuidCounter + 1) % Number.MAX_SAFE_INTEGER;
	const counter = cuidCounter.toString(36);
	const random = randomBlock(4);
	// префикс "c" как в оригинале
	return `c${timestamp}${pad(counter, 2)}${random}`;
}
