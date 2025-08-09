import { Shield } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ProviderTypes } from "@/entities/profile/types/profileTypes";
import { AiTypes } from "@/shared/types/AiTypes";
import { AI_MODELS_DATA } from "@/features/resources/const/AI_MODELS";

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

export function getModelById(id: AiTypes) {
	return AI_MODELS_DATA.find((model) => model.id === id);
}