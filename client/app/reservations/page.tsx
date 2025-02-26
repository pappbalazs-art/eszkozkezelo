"use client";

import ReservationsTable from "./reservations-table";
import { Spacer } from "@heroui/spacer";

export default function UsersPage() {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Foglalások
			</h1>

			<Spacer y={5} />

			<ReservationsTable />
		</>
	);
}
