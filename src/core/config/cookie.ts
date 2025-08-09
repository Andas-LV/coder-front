import Cookies from "js-cookie";

export const getAuthToken = () => {
	const token = Cookies.get("next-auth.session-token");

	if (token) {
		return token;
	}

	return null;
};

export const removeAuthToken = () => {
	Cookies.remove("next-auth.session-token", { path: "/" });
};
