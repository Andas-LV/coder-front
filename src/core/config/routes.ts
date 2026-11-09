export const routes = {
	home: () => "/",
	login: () => "/auth/login",
	profile: () => "/profile",
	resources: () => "/resources",
	chats: (chatId?: string) =>
		chatId ? `/chats?chat=${encodeURIComponent(chatId)}` : "/chats",
};
