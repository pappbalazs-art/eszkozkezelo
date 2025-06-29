import { Button } from "@/components/button";
import { Form, FormError } from "@/components/form";
import { Input } from "@/components/input";
import {
	Modal,
	ModalBody,
	ModalContainer,
	ModalHeader,
	ModalTitle,
} from "@/components/modal";
import { Select, Selection, SelectItem } from "@/components/select";
import { Textarea } from "@/components/textarea";
import { fetchCategories } from "@/hooks/categories";
import { createItem } from "@/hooks/items";
import { useAuth } from "@/providers/auth-context";
import { Category } from "@/types/category";
import { ReactNode, useCallback, useEffect, useState } from "react";

type CreateItemModalProps = {
	isOpen: boolean;
	close: () => void;
	updateData: () => Promise<void>;
};

export default function CreateItemModal({
	isOpen,
	close,
	updateData,
}: CreateItemModalProps): ReactNode {
	const [name, setName] = useState<string>("");
	const [serialNumber, setSerialNumber] = useState<string>("");
	const [categoryId, setCategoryId] = useState<Selection>({} as Selection);
	const [description, setDescription] = useState<string>("");
	const [errors, setErrors] = useState<FormError>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const [categories, setCategories] = useState<Array<Category>>([]);

	const { user } = useAuth();

	const isSubmitButtonDisabled = (): boolean => {
		return !(name && categoryId.key);
	};

	const handleCreateItem = useCallback(async (): Promise<void> => {
		if (!user) {
			return;
		}

		setIsLoading(true);

		await createItem({
			name: name,
			serial_number: serialNumber,
			category_uid: categoryId.key,
			description: description,
			created_by: user.id,
		});
		await updateData();

		close();
	}, [
		setIsLoading,
		close,
		updateData,
		user,
		name,
		serialNumber,
		categoryId,
		description,
	]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setName("");
		setSerialNumber("");
		setCategoryId({} as Selection);
		setDescription("");
		setErrors({});
		setIsLoading(false);
	}, [isOpen]);

	useEffect(() => {
		const fetchCategoriesData = async (): Promise<void> => {
			const { data: categories } = await fetchCategories();
			const sortedCategories = categories.sort(
				(a: Category, b: Category) =>
					a.name.toLowerCase().localeCompare(b.name.toLowerCase())
			);

			setCategories(sortedCategories);
		};

		fetchCategoriesData();
	}, []);

	return (
		<Modal isOpen={isOpen} close={close}>
			<ModalContainer>
				<ModalHeader>
					<ModalTitle>Eszköz hozzáadása</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Form
						errors={errors}
						setErrors={setErrors}
						handleSubmit={handleCreateItem}
					>
						<Input
							type="text"
							name="name"
							label="Név"
							value={name}
							onValueChange={setName}
							fullWidth
							required
						/>
						<Input
							type="text"
							name="serial_number"
							label="Szériaszám"
							value={serialNumber}
							onValueChange={setSerialNumber}
							fullWidth
						/>
						<Select
							name="category"
							label="Kategória"
							value={categoryId}
							onValueChange={setCategoryId}
							fullWidth
							required
						>
							{categories.map(
								(category: Category): ReactNode => (
									<SelectItem
										key={category.id}
										value={category.id}
									>
										{category.name}
									</SelectItem>
								)
							)}
						</Select>
						<Textarea
							name="description"
							label="Leírás"
							value={description}
							onValueChange={setDescription}
							fullWidth
						/>

						<Button
							fullWidth
							isLoading={isLoading}
							isDisabled={isSubmitButtonDisabled()}
						>
							Új eszköz hozzáadása
						</Button>
					</Form>
				</ModalBody>
			</ModalContainer>
		</Modal>
	);
}
