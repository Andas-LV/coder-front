import axiosInstance from "@/shared/api/axiosInstance";
import { IProfile } from "@/entities/profile/types/profileTypes";

export async function fetchProfile(): Promise<IProfile> {
	const { data } = await axiosInstance.get("/account/me");
	return data;
}