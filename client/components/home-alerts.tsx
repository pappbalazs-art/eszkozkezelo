import { database } from "@/firebase";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function HomePageAlerts() {
	const [requestedReservations, setRequestedReservations] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchRequestedReservations = async () => {
			const reservationsRef = collection(database, "reservations");
			const reservationsQuery = query(
				reservationsRef,
				where("status", "==", "requested")
			);
			const reservationsSnapshot = await getDocs(reservationsQuery);

			setRequestedReservations(
				reservationsSnapshot.docs.map((doc: any) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
			setLoading(false);
		};

		fetchRequestedReservations();
	});

	return (
		requestedReservations.length > 0 && (
			<Alert
				className="mb-8"
				color="primary"
				variant="flat"
				title="Vannak elfogadásra váró foglalások!"
				endContent={
					<Button
						className="self-center"
						as={Link}
						color="primary"
						variant="flat"
						size="sm"
						href="/reservations"
					>
						Megtekintés
					</Button>
				}
			/>
		)
	);
}
