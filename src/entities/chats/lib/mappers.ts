import type {
	AttachmentDto,
	ChatDetailDto,
	ChatOutDto,
	IChatById,
	IAttachment,
	IChatsList,
	ICreateChat,
	IMessage,
	IRequest,
	ISource,
	IUpdateChat,
	MessageOutDto,
	SourceDto,
} from "../types/chatsTypes";

export const toChat = (dto: ChatOutDto): IChatsList => ({
	id: dto.id,
	title: dto.title,
	model: dto.model,
	systemPrompt: dto.system_prompt,
	createdAt: dto.created_at,
	updatedAt: dto.updated_at,
});

export const toSource = (s: SourceDto): ISource => ({
	n: s.n,
	documentId: s.document_id,
	filename: s.filename,
	page: s.page,
	score: s.score,
});

export const toAttachments = (
	list: AttachmentDto[] | null | undefined,
): IAttachment[] | null =>
	list
		? list.map((a) => ({ documentId: a.document_id, filename: a.filename, pages: a.pages }))
		: null;

export const toSources = (list: SourceDto[] | null | undefined): ISource[] | null =>
	list ? list.map(toSource) : null;

export const toMessage = (dto: MessageOutDto): IMessage => ({
	id: dto.id,
	role: dto.role,
	content: dto.content,
	model: dto.model,
	inputTokens: dto.input_tokens,
	outputTokens: dto.output_tokens,
	latencyMs: dto.latency_ms,
	costUsd: dto.cost_usd,
	createdAt: dto.created_at,
	sources: toSources(dto.sources),
	attachments: toAttachments(dto.attachments),
});

/** Метаданные ответа ассистента, которые кладём в IRequest. */
type AssistantMeta = Pick<
	IRequest,
	"responseId" | "model" | "inputTokens" | "outputTokens" | "latencyMs" | "costUsd" | "sources"
>;

export const assistantMeta = (m: IMessage): AssistantMeta => ({
	responseId: m.id,
	model: m.model,
	inputTokens: m.inputTokens,
	outputTokens: m.outputTokens,
	latencyMs: m.latencyMs,
	costUsd: m.costUsd,
	sources: m.sources,
});

/** Плоский список сообщений → пары user/assistant. system-сообщения пропускаем. */
export function toRequests(messages: IMessage[]): IRequest[] {
	const out: IRequest[] = [];
	for (const m of messages) {
		if (m.role === "user") {
			out.push({
				id: m.id,
				createdAt: m.createdAt,
				prompt: m.content,
				attachments: m.attachments,
				response: "",
			});
		} else if (m.role === "assistant") {
			const last = out.at(-1);
			if (last) out[out.length - 1] = { ...last, response: m.content, ...assistantMeta(m) };
		}
	}
	return out;
}

export const toChatById = (dto: ChatDetailDto): IChatById => ({
	...toChat(dto),
	requests: toRequests(dto.messages.map(toMessage)),
});

export const toCreateChatDto = (p: ICreateChat) => ({
	title: p.title,
	model: p.model,
	system_prompt: p.systemPrompt,
});

export const toUpdateChatDto = (p: IUpdateChat) => {
	const body: Record<string, unknown> = {};
	if (p.title !== undefined) body.title = p.title;
	if (p.model !== undefined) body.model = p.model;
	if (p.systemPrompt !== undefined) body.system_prompt = p.systemPrompt;
	return body;
};
