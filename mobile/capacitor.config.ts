import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.coder.app",
	appName: "Coder",
	server: {
		url: "https://coder-front.vercel.app",
		androidScheme: "https",
		allowNavigation: [
			"coder-front.vercel.app",
			"coder-backend-uy9s.onrender.com",
			"accounts.google.com",
			"github.com",
		],
	},
};

export default config;
