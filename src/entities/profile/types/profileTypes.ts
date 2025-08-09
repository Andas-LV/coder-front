export interface IProfile {
	id: string;
	provider: ProviderTypes;
	providerId: string;
	email: string;
	name: string;
	image: string;
	updatedAt: string;
}

export type ProviderTypes = "google" | "github";
