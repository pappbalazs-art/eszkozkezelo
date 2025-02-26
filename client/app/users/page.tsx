"use client";

import UsersTable from "./users-table";
import { Spacer } from "@heroui/spacer";

export default function UsersPage() {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Felhasználók
			</h1>

			<Spacer y={5} />

			<UsersTable />
		</>
	);
}
