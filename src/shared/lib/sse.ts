export interface SSEMessage {
	event: string;
	data: string;
}

/** Разбирает text/event-stream на события. Поток закрывается при выходе из цикла. */
export async function* parseSSE(
	stream: ReadableStream<Uint8Array>,
): AsyncGenerator<SSEMessage> {
	const reader = stream.getReader();
	const decoder = new TextDecoder();
	let buf = "";

	try {
		while (true) {
			const { value, done } = await reader.read();
			if (done) return;

			buf = (buf + decoder.decode(value, { stream: true })).replace(/\r\n/g, "\n");

			let end: number;
			while ((end = buf.indexOf("\n\n")) !== -1) {
				yield parseBlock(buf.slice(0, end));
				buf = buf.slice(end + 2);
			}
		}
	} finally {
		reader.cancel().catch(() => {});
	}
}

function parseBlock(block: string): SSEMessage {
	let event = "message";
	const data: string[] = [];

	for (const line of block.split("\n")) {
		if (line.startsWith("event:")) event = line.slice(6).trim();
		else if (line.startsWith("data:")) data.push(line.slice(5).replace(/^ /, ""));
	}

	// многострочные данные приходят несколькими data: — склеиваем через \n
	return { event, data: data.join("\n") };
}
