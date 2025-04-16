"use client";

import withAuth from "@/utils/withAuth";
import UsersTable from "./users-table";
import { Spacer } from "@heroui/spacer";

const UsersPage = () => {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Felhasználók
			</h1>

			<Spacer y={5} />

			<UsersTable />
		</>
	);
};

export default withAuth(UsersPage);
