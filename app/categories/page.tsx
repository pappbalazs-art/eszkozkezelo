"use client";

import {
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import withAdminAuth from "@/utils/with-admin-auth";
import { Container, ContainerTitle } from "@/components/container";
import { Category } from "@/types/category";
import fetchCategories from "@/hooks/fetch-categories";
import {
	Table,
	TableBody,
	TableColumn,
	TableColumnType,
	TableContainer,
	TableHeader,
	TableRow,
} from "@/components/table";
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

function CategoriesPage(): ReactNode {
	const [categories, setCategories] = useState<Array<Category>>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const tableColumns: Array<TableColumnType> = [
		{
			key: "name",
			label: "Név",
		},
		{
			key: "length",
			label: "Eszközök száma",
		},
		{
			key: "actions",
		},
	];

	const searchFilter = (searchParam: string, item: Category): boolean => {
		return item.name.toLowerCase().includes(searchParam.toLowerCase());
	};

	const fetchData = useCallback(async (): Promise<void> => {
		const { data } = await fetchCategories();
		setCategories(data);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<Container>
			<ContainerTitle>Kategóriák</ContainerTitle>

			<Table
				items={categories}
				columns={tableColumns}
				hasSearchBar
				searchFilter={searchFilter}
				isLoading={isLoading}
			>
				<TableHeader>
					<Button size="compact" startContent={<PlusIcon />}>
						Kategória hozzáadása
					</Button>
				</TableHeader>
				<TableContainer>
					<TableBody>
						{(category: Category): ReactElement => (
							<TableRow>
								<TableColumn>{category.name}</TableColumn>
								<TableColumn>{category.length}</TableColumn>
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

export default withAdminAuth(CategoriesPage);
