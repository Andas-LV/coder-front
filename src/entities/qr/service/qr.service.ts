import axiosInstance from "@/shared/api/axiosInstance";
import { ICreatedQr, IApproveQr, QRAuthData } from "@/entities/qr";

export async function createQr(): Promise<ICreatedQr> {
	const { data } = await axiosInstance.post("/qr-login/");
	return data;
}

export async function approveQr(payload: IApproveQr): Promise<QRAuthData> {
	const { data } = await axiosInstance.post("/qr-login/approve", payload);
	return data;
}
