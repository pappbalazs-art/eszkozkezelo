type UserRoles = "user" | "admin";
type UserStatuses = "inactive" | "active";

export type User = {
	id: string;
	name: string;
	email: string;
	neptun_code: string;
	role: UserRoles;
	status: UserStatuses;
	user_uid: string;
};
