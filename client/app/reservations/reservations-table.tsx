"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
	Button,
	Chip,
	ChipProps,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Input,
	Selection,
	SortDescriptor,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@heroui/react";

import { database } from "@/firebase";
import {
	collection,
	doc,
	getDocs,
	query,
	Timestamp,
	updateDoc,
	where,
} from "firebase/firestore";
import {
	ChevronDownIcon,
	SearchIcon,
	VerticalDotsIcon,
} from "@/components/icons";
import ViewReservationModal from "./view-reservation-modal";
import getDateStringFromTimestamp from "@/utils/date-string-from-timestamp";
import { useRouter } from "next/navigation";

export const columns = [
	{ name: "NÉV", uid: "name" },
	{ name: "METTŐL", uid: "from_timestamp", sortable: true },
	{ name: "MEDDIG", uid: "to_timestamp", sortable: true },
	{ name: "STÁTUSZ", uid: "status", sortable: true },
	{ name: "AKCIÓK", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
	"name",
	"from_timestamp",
	"to_timestamp",
	"status",
	"actions",
];

export const statusOptions = [
	{ name: "Kérvényezett", uid: "requested" },
	{ name: "Elfogadott", uid: "accepted" },
	{ name: "Visszahozott", uid: "completed" },
	{ name: "Elutasított", uid: "declined" },
];

export const statusColorMap: Record<string, ChipProps["color"]> = {
	requested: "warning",
	accepted: "success",
	completed: "primary",
	declined: "danger",
};

export default function ReservationsTable() {
	const [reservations, setReservations] = useState<any>([]);
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [loading, setLoading] = useState<boolean>(true);

	const viewReservationDisclosure = useDisclosure();

	const router = useRouter();

	const [filterValue, setFilterValue] = useState("");
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "from_timestamp",
		direction: "descending",
	});

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...reservations];

		if (hasSearchFilter) {
			filteredUsers = filteredUsers.filter((user) =>
				user.name.toLowerCase().includes(filterValue.toLowerCase())
			);
		}

		if (
			statusFilter !== "all" &&
			Array.from(statusFilter).length !== statusOptions.length
		) {
			filteredUsers = filteredUsers.filter((user) =>
				Array.from(statusFilter).includes(user.status)
			);
		}

		return filteredUsers;
	}, [reservations, filterValue, statusFilter]);

	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a: any, b: any) => {
			const first = a[sortDescriptor.column as keyof any] as number;
			const second = b[sortDescriptor.column as keyof any] as number;
			const cmp = first < second ? -1 : first > second ? 1 : 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});
	}, [sortDescriptor, filteredItems]);

	const onSearchChange = useCallback((value?: string) => {
		if (value) {
			setFilterValue(value);
		} else {
			setFilterValue("");
		}
	}, []);

	const onClear = useCallback(() => {
		setFilterValue("");
	}, []);

	const markReservationAsUpdated = async (reservationUID: any) => {
		await updateDoc(doc(database, "reservations", reservationUID), {
			status: "completed",
		});
		await updateReservations();
	};

	const updateReservations = async () => {
		const snapshot = await getDocs(collection(database, "reservations"));

		setReservations(
			snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
		);
		setLoading(false);
	};

	const getUserNameByUID = async (userUID: string) => {
		const usersRef = collection(database, "users");
		const userDataQuery = query(usersRef, where("user_uid", "==", userUID));
		const snapshot = await getDocs(userDataQuery);

		return snapshot.docs[0].data().name;
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
			case "status":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[reservation.status]}
						size="sm"
						variant="flat"
					>
						{
							statusOptions.filter(
								(status) => status.uid === reservation.status
							)[0].name
						}
					</Chip>
				);
			case "actions":
				const actions = [
					{
						key: "view",
						label: "Részletek",
						onPress: () => {
							setSelectedReservation(reservation);
							viewReservationDisclosure.onOpen();
						},
					},
				];

				if (reservation.status === "requested") {
					actions.unshift({
						key: "review",
						label: "Áttekintés",
						onPress: () =>
							router.push("/reservation?id=" + reservation.id),
					});
				}

				if (reservation.status === "accepted") {
					actions.push({
						key: "mark-as-completed",
						label: "Megjelölés visszahozottként",
						onPress: () => {
							markReservationAsUpdated(reservation.id);
						},
					});
				}

				return (
					<div className="relative flex justify-end items-center gap-2">
						<Dropdown>
							<DropdownTrigger>
								<Button isIconOnly size="sm" variant="light">
									<VerticalDotsIcon className="text-default-300" />
								</Button>
							</DropdownTrigger>
							<DropdownMenu items={actions}>
								{(item) => (
									<DropdownItem
										key={item.key}
										onPress={item.onPress}
									>
										{item.label}
									</DropdownItem>
								)}
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
					<Input
						isClearable
						className="w-full sm:max-w-[44%]"
						placeholder="Keresés név alapján..."
						startContent={<SearchIcon />}
						value={filterValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>

					<div className="flex gap-3">
						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat"
								>
									Státusz
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								closeOnSelect={false}
								selectedKeys={statusFilter}
								selectionMode="multiple"
								onSelectionChange={setStatusFilter}
							>
								{statusOptions.map((status) => (
									<DropdownItem
										key={status.uid}
										className="capitalize"
									>
										{status.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>

						<Dropdown>
							<DropdownTrigger className="hidden sm:flex">
								<Button
									endContent={
										<ChevronDownIcon className="text-small" />
									}
									variant="flat"
								>
									Oszlopok
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								disallowEmptySelection
								closeOnSelect={false}
								selectedKeys={visibleColumns}
								selectionMode="multiple"
								onSelectionChange={setVisibleColumns}
							>
								{columns.map((column) => (
									<DropdownItem
										key={column.uid}
										className="capitalize"
									>
										{column.name}
									</DropdownItem>
								))}
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>
			</div>
		);
	}, [
		filterValue,
		statusFilter,
		visibleColumns,
		onSearchChange,
		hasSearchFilter,
	]);

	return (
		<>
			<ViewReservationModal
				isOpen={viewReservationDisclosure.isOpen}
				onOpen={viewReservationDisclosure.onOpen}
				onOpenChange={viewReservationDisclosure.onOpenChange}
				selectedReservation={selectedReservation}
			/>

			<Table
				className="z-0"
				isStriped
				sortDescriptor={sortDescriptor}
				topContent={topContent}
				topContentPlacement="outside"
				onSortChange={setSortDescriptor}
				removeWrapper
			>
				<TableHeader columns={headerColumns}>
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
					emptyContent={"Nem található egyetlen foglalás sem..."}
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
