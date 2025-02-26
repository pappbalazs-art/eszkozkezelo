"use client";

import { database } from "@/firebase";
import getDateStringFromTimestamp from "@/utils/date-string-from-timestamp";
import { Spacer } from "@heroui/spacer";
import { Selection } from "@react-types/shared";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import ReservationTable from "./reservation-table";
import { Button } from "@heroui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardBody } from "@heroui/card";

export default function ReservationPage() {
	const [reservation, setReservation] = useState<any>();
	const [user, setUser] = useState<any>();
	const [loading, setLoading] = useState<boolean>(true);

	const [selectedItems, setSelectedItems] = useState<Selection>(new Set([]));

	const router = useRouter();
	const searchParams = useSearchParams();

	const id = searchParams.get("id");

	const handleMarkReservationAsAccepted = async () => {
		if (!id) return;

		await updateDoc(doc(database, "reservations", id), {
			status: "accepted",
		});

		router.push("/reservations");
	};

	useEffect(() => {
		const fetchReservation = async () => {
			if (!id) return;

			const usersRef = collection(database, "users");

			const reservationSnapshot = await getDoc(
				doc(database, "reservations", id)
			);

			const usersQuery = query(
				usersRef,
				where("user_uid", "==", reservationSnapshot.data()?.user_uid)
			);
			const usersSnapshot = await getDocs(usersQuery);

			setReservation(reservationSnapshot.data());
			setUser(usersSnapshot.docs[0].data());
			setLoading(false);
		};

		fetchReservation();
	}, []);

	return (
		!loading && (
			<>
				<h1 className="tracking-tight inline font-bold text-3xl">
					{user.name}
				</h1>

				<span className="text-lg px-3">
					{getDateStringFromTimestamp(reservation.from_timestamp)}
					{" – "}
					{getDateStringFromTimestamp(reservation.to_timestamp)}
				</span>

				<Spacer />

				<div className="pt-8">
					<ReservationTable
						itemIDs={reservation.items}
						selectedItems={selectedItems}
						setSelectedItems={setSelectedItems}
					/>

					<Card className="mt-8 p-2" shadow="sm">
						<CardBody>
							<span className="font-bold">Megjegyzés: </span>
							{reservation.comment}
						</CardBody>
					</Card>
				</div>

				<div className="flex justify-end gap-2 pt-8">
					<Button
						color="primary"
						onPress={() => handleMarkReservationAsAccepted()}
					>
						Elfogadás
					</Button>
				</div>
			</>
		)
	);
}
