export const sendEmail = async (
	email: string,
	subject: string,
	message: string
): Promise<any> => {
	const params = new FormData();
	params.append("email", email);
	params.append("subject", subject);
	params.append("message", message);

	const response = await fetch("https://pappbalazs.com/api/message", {
		method: "POST",
		mode: "no-cors",
		body: params,
	});

	return response;
};
