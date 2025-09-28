import { UserFullInfo } from "@/entities/qr";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const handleQrLogin = async (user: UserFullInfo) => {
	const res = await signIn("credentials", {
		redirect: false,
		user: JSON.stringify(user),
	});

	if (res?.ok) {
		toast.success("Вы успешно вошли в аккаунт", {
			position: "top-center",
		});
	} else {
		toast.error("Ошибка при входе по QR");
	}
};