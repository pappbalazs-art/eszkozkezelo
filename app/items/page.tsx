"use client";

import {
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import withAdminAuth from "@/utils/with-admin-auth";
import { Item } from "@/types/item";
import { Container, ContainerTitle } from "@/components/container";
import {
	Table,
	TableBody,
	TableColumn,
	TableColumnType,
	TableContainer,
	TableHeader,
	TableRow,
} from "@/components/table";
import { fetchItems } from "@/hooks/items";
import { Button } from "@/components/button";
import {
	DeleteIcon,
	EditIcon,
	EllipsisIcon,
	PlusIcon,
} from "@/components/icons";
import {
	Dropdown,
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuLink,
	DropdownTrigger,
} from "@/components/dropdown";

function ItemsPage(): ReactNode {
	const [items, setItems] = useState<Array<Item>>([]);
	const [selectedItem, setSelectedItem] = useState<Item>({} as Item);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const tableColumns: Array<TableColumnType> = [
		{
			key: "name",
			label: "Név",
		},
		{
			key: "serial_number",
			label: "Szériaszám",
		},
		{
			key: "category_uid",
			label: "Kategória",
		},
		{
			key: "actions",
		},
	];

	const searchFilter = (searchParam: string, item: Item): boolean => {
		return item.name.toLowerCase().includes(searchParam.toLowerCase());
	};

	const fetchData = useCallback(async (): Promise<void> => {
		const { data } = await fetchItems();

		setItems(data);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<Container>
			<ContainerTitle>Eszközök</ContainerTitle>

			<Table
				items={items}
				columns={tableColumns}
				hasSearchBar
				searchFilter={searchFilter}
				isLoading={isLoading}
			>
				<TableHeader>
					<Button size="compact" startContent={<PlusIcon />}>
						Eszköz hozzáadása
					</Button>
				</TableHeader>
				<TableContainer>
					<TableBody>
						{(item: Item): ReactElement => (
							<TableRow>
								<TableColumn>{item.name}</TableColumn>
								<TableColumn>{item.serial_number}</TableColumn>
								<TableColumn>{item.category_name}</TableColumn>
								<TableColumn>
									<Dropdown>
										<DropdownTrigger>
											<EllipsisIcon />
										</DropdownTrigger>

										<DropdownMenu>
											<DropdownMenuItem>
												<DropdownMenuLink
													href=""
													icon={<EditIcon />}
												>
													Szerkesztés
												</DropdownMenuLink>
											</DropdownMenuItem>
											<DropdownMenuItem color="danger">
												<DropdownMenuLink
													href=""
													icon={<DeleteIcon />}
												>
													Törlés
												</DropdownMenuLink>
											</DropdownMenuItem>
										</DropdownMenu>
									</Dropdown>
								</TableColumn>
							</TableRow>
						)}
					</TableBody>
				</TableContainer>
			</Table>
		</Container>
	);
}

export default withAdminAuth(ItemsPage);
