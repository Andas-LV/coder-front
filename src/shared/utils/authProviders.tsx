import { Shield } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ProviderTypes } from "@/entities/profile/types/profileTypes";

export const getProviderIcon = (provider: ProviderTypes) => {
	switch (provider) {
		case "google":
			return <FcGoogle />;
		case "github":
			return <FaGithub />;
		default:
			return <Shield />;
	}
};

export const getProviderName = (provider: ProviderTypes) => {
	switch (provider) {
		case "google":
			return "Google";
		case "github":
			return "GitHub";
		default:
			return "Неизвестно";
	}
};
