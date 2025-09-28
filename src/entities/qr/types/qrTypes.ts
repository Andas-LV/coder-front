export interface ICreatedQr {
	token: string;
}

export interface IApproveQr {
	userId: string;
	token: string;
}

export interface QRAuthData {
	type: string;
	user: UserFullInfo;
}

export interface UserFullInfo {
	id: string;
	email: string;
	name: string;
	image: string;
	provider: string;
	providerId: string;
	createdAt: string;
	updatedAt: string;
}