import { AiTypes } from "@/shared/types/AiTypes";

export interface ICreateChat {
	aiProvider: AiTypes;
}

export interface IChatsList {
	id: string;
	name: string;
	aiProvider: AiTypes;
	updatedAt: string;
}

export interface IChatById {
	id: string;
	name: string;
	aiProvider: AiTypes;
	authorId: string;
	requests: IRequest[];
	createdAt: string;
	updatedAt: string;
}

export interface IRequest {
	id: string;
	createdAt: string;
	prompt: string;
	response: string;
}
