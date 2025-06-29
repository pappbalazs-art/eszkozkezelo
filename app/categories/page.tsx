"use client";

import {
	ReactElement,
	ReactNode,
	useCallback,
	useEffect,
	useState,
} from "react";
import withAdminAuth from "@/utils/with-admin-auth";
import { Category } from "@/types/category";
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
import {
	CreateCategoryModal,
	DeleteCategoryModal,
	EditCategoryModal,
} from "@/components/modals/categories";
import { useDisclosure } from "@/utils/use-disclosure";
import { fetchCategories } from "@/hooks/categories";

function CategoriesPage(): ReactNode {
	const [categories, setCategories] = useState<Array<Category>>([]);
	const [selectedCategory, setSelectedCategory] = useState<Category>(
		{} as Category
	);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const createCategoryModalDisclosure = useDisclosure();
	const deleteCategoryModalDisclosure = useDisclosure();
	const editCategoryModalDisclosure = useDisclosure();

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
		const { data: categories } = await fetchCategories();

		setCategories(categories);
		setIsLoading(false);
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return (
		<>
			<CreateCategoryModal
				isOpen={createCategoryModalDisclosure.isOpen}
				close={createCategoryModalDisclosure.close}
				updateData={fetchData}
			/>

			<DeleteCategoryModal
				isOpen={deleteCategoryModalDisclosure.isOpen}
				close={deleteCategoryModalDisclosure.close}
				category={selectedCategory}
				updateData={fetchData}
			/>

			<EditCategoryModal
				isOpen={editCategoryModalDisclosure.isOpen}
				close={editCategoryModalDisclosure.close}
				category={selectedCategory}
				updateData={fetchData}
			/>

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
						<Button
							size="compact"
							startContent={<PlusIcon />}
							onClick={createCategoryModalDisclosure.open}
						>
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
												<DropdownMenuItem
													onClick={() => {
														setSelectedCategory(
															category
														);
														editCategoryModalDisclosure.open();
													}}
												>
													<DropdownMenuLink
														href=""
														icon={<EditIcon />}
													>
														Szerkesztés
													</DropdownMenuLink>
												</DropdownMenuItem>
												<DropdownMenuItem
													color="danger"
													onClick={() => {
														setSelectedCategory(
															category
														);
														deleteCategoryModalDisclosure.open();
													}}
												>
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
		</>
	);
}

export default withAdminAuth(CategoriesPage);
