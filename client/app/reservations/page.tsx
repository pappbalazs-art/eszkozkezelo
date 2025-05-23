"use client";

import withAuth from "@/utils/withAuth";
import ReservationsTable from "./reservations-table";
import { Spacer } from "@heroui/spacer";

const ReservationsPage = () => {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Foglalások
			</h1>

			<Spacer y={5} />

			<ReservationsTable />
		</>
	);
};

export default withAuth(ReservationsPage);
