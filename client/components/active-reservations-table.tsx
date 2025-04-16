import { database } from "@/firebase";
import getDateStringFromTimestamp from "@/utils/date-string-from-timestamp";
import { Button } from "@heroui/button";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { useDisclosure } from "@heroui/use-disclosure";
import { getLocalTimeZone, today } from "@internationalized/date";
import { SortDescriptor } from "@react-types/shared";
import {
	and,
	collection,
	getDocs,
	query,
	Timestamp,
	where,
} from "firebase/firestore";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PlusIcon, VerticalDotsIcon } from "./icons";
import ViewReservationModal from "@/app/reservations/view-reservation-modal";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";
import { Link } from "@heroui/link";
import { useAuth } from "@/AuthContext";

export const columns = [
	{ name: "NÉV", uid: "name" },
	{ name: "METTŐL", uid: "from_timestamp", sortable: true },
	{ name: "MEDDIG", uid: "to_timestamp", sortable: true },
	{ name: "AKCIÓK", uid: "actions" },
];

export default function ActiveReservationsTable() {
	const { user, isAuthenticated } = useAuth();

	const [reservations, setReservations] = useState<any>([]);
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [loading, setLoading] = useState<boolean>(true);

	const viewReservationDisclosure = useDisclosure();

	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "from_timestamp",
		direction: "descending",
	});

	const sortedItems = useMemo(() => {
		return [...reservations].sort((a: any, b: any) => {
			const first = a[sortDescriptor.column as keyof any] as number;
			const second = b[sortDescriptor.column as keyof any] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, reservations]);

	const getUserNameByUID = async (userUID: string) => {
		const usersRef = collection(database, "users");
		const userDataQuery = query(usersRef, where("user_uid", "==", userUID));
		const snapshot = await getDocs(userDataQuery);

		return snapshot.docs[0].data().name;
	};

	const updateReservations = async () => {
		if (user.role === "admin") {
			const currentDate = today(getLocalTimeZone());
			const currentTimestamp = Timestamp.fromDate(
				new Date(
					currentDate.year,
					currentDate.month - 1,
					currentDate.day
				)
			);

			const reservationsRef = collection(database, "reservations");
			const reservationsQuery = query(
				reservationsRef,
				where("from_timestamp", "<=", currentTimestamp),
				where("to_timestamp", ">=", currentTimestamp)
			);
			const reservationsSnapshot = await getDocs(reservationsQuery);

			setReservations(
				reservationsSnapshot.docs
					.map((doc: any) => ({
						...doc.data(),
						id: doc.id,
					}))
					.filter(
						(reservation: any) => reservation.status === "accepted"
					)
			);
			setLoading(false);

			return;
		}

		if (user.role === "user") {
			const reservationsRef = collection(database, "reservations");
			const reservationsQuery = query(
				reservationsRef,
				where("user_uid", "==", user.user_uid)
			);
			const reservationSnapshot = await getDocs(reservationsQuery);

			setReservations(
				reservationSnapshot.docs.map((doc: any) => ({
					...doc.data(),
					id: doc.id,
				}))
			);
			setLoading(false);

			return;
		}
	};

	useEffect(() => {
		updateReservations();
	}, []);

	const renderCell = useCallback((reservation: any, columnKey: React.Key) => {
		const cellValue = reservation[columnKey as keyof any];

		switch (columnKey) {
			case "name":
				return (
					<p className="font-bold">
						{getUserNameByUID(reservation.user_uid)}
					</p>
				);
			case "from_timestamp":
			case "to_timestamp":
				return getDateStringFromTimestamp(cellValue);
			case "actions":
				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<VerticalDotsIcon className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu>
								<DropdownItem
									key="view"
									onPress={() => {
										setSelectedReservation(reservation);
										viewReservationDisclosure.onOpen();
									}}
								>
									Megtekintés
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				);
			default:
				return cellValue;
		}
	}, []);

	const topContent = useMemo(() => {
		return (
			<div className="flex flex-col gap-4">
				<div className="flex justify-between gap-3 items-end">
					<h1 className="tracking-tight inline font-bold text-3xl">
						{user.role === "admin" && "Aktív foglalások"}
						{user.role === "user" && "Foglalásaim"}
					</h1>

					<Button
						as={Link}
						color="primary"
						endContent={<PlusIcon />}
						href="/reserve"
					>
						Új foglalás
					</Button>
				</div>
			</div>
		);
	}, [reservations]);

	return (
		<>
			<ViewReservationModal
				isOpen={viewReservationDisclosure.isOpen}
				onOpen={viewReservationDisclosure.onOpen}
				onOpenChange={viewReservationDisclosure.onOpenChange}
				selectedReservation={selectedReservation}
			/>

			<Table
				isHeaderSticky
				isStriped
				sortDescriptor={sortDescriptor}
				topContent={topContent}
				topContentPlacement="outside"
				onSortChange={setSortDescriptor}
				removeWrapper
			>
				<TableHeader columns={columns}>
					{(column) => (
						<TableColumn
							key={column.uid}
							align={column.uid === "actions" ? "end" : "start"}
							allowsSorting={column.sortable}
						>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody
					isLoading={loading}
					loadingContent={<Spinner color="primary" />}
					emptyContent={
						"Nem található egyetlen aktív foglalás sem..."
					}
					items={sortedItems}
				>
					{(item: any) => (
						<TableRow key={item.id}>
							{(columnKey) => (
								<TableCell>
									{renderCell(item, columnKey)}
								</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>
		</>
	);
}
