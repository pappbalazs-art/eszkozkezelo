"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Selection, SortDescriptor } from "@heroui/react";

import { database } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import {
	ChevronDownIcon,
	PlusIcon,
	SearchIcon,
	VerticalDotsIcon,
} from "@/components/icons";
import { Chip, ChipProps } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/table";
import { Spinner } from "@heroui/spinner";

export const columns = [
	{ name: "NÉV", uid: "name", sortable: true },
	{ name: "NEPTUN KÓD", uid: "neptun_code" },
	{ name: "JOGOSULTSÁG", uid: "role", sortable: true },
	{ name: "STÁTUSZ", uid: "status", sortable: true },
	{ name: "AKCIÓK", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
	"name",
	"email",
	"neptun_code",
	"role",
	"status",
	"actions",
];

export const statusOptions = [
	{ name: "Aktív", uid: "active" },
	{ name: "Inaktív", uid: "inactive" },
];

const statusColorMap: Record<string, ChipProps["color"]> = {
	active: "success",
	inactive: "warning",
};

export const roleOptions = [
	{ name: "Admin", uid: "admin" },
	{ name: "Felhasználó", uid: "user" },
];

export default function UsersTable() {
	const [users, setUsers] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const [filterValue, setFilterValue] = useState("");
	const [visibleColumns, setVisibleColumns] = useState<Selection>(
		new Set(INITIAL_VISIBLE_COLUMNS)
	);
	const [statusFilter, setStatusFilter] = useState<Selection>("all");
	const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
		column: "name",
		direction: "ascending",
	});

	const hasSearchFilter = Boolean(filterValue);

	const headerColumns = useMemo(() => {
		if (visibleColumns === "all") return columns;

		return columns.filter((column) =>
			Array.from(visibleColumns).includes(column.uid)
		);
	}, [visibleColumns]);

	const filteredItems = useMemo(() => {
		let filteredUsers = [...users];

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
	}, [users, filterValue, statusFilter]);

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

	useEffect(() => {
		const fetchUsers = async () => {
			const snapshot = await getDocs(collection(database, "users"));

			setUsers(
				snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
			);
			setLoading(false);
		};

		fetchUsers();
	}, []);

	const renderCell = useCallback((user: any, columnKey: React.Key) => {
		const cellValue = user[columnKey as keyof any];

		switch (columnKey) {
			case "name":
				return <p className="font-bold">{cellValue}</p>;
			case "role":
				return roleOptions.filter((role) => role.uid === user.role)[0]
					.name;
			case "status":
				return (
					<Chip
						className="capitalize"
						color={statusColorMap[user.status]}
						size="sm"
						variant="flat"
					>
						{
							statusOptions.filter(
								(status) => status.uid === user.status
							)[0].name
						}
					</Chip>
				);
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
								<DropdownItem key="view" onPress={() => null}>
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
					emptyContent={"Nem található egyetlen felhasználó sem..."}
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
