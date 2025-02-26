import { Spacer } from "@heroui/spacer";
import ActiveReservationsTable from "./active-reservations-table";

export default function ActiveReservations() {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Aktív foglalások
			</h1>

			<ActiveReservationsTable />
		</>
	);
}
