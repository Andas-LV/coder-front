import axiosInstance from "@/shared/api/axiosInstance";
import { IProfile } from "@/entities/profile/types/profileTypes";
import { toCamelCase } from "@/shared/utils/case";

// ⚠️ GET /account/me пока не реализован в FastAPI (FRONTEND_MIGRATION.md, раздел 7).
export async function fetchProfile(): Promise<IProfile> {
	const { data } = await axiosInstance.get("/account/me");
	return toCamelCase<IProfile>(data);
}
