import { AiTypes } from "@/shared/types/AiTypes";

export const routes = {
	home: () => "/",
	login: () => "/auth/login",
	profile: () => "/profile",
	resources: () => "/resources",
	ai: (ai: AiTypes) => `/ai/${ai}`,
	chats: () => "/chats",
};
