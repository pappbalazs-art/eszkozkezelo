import { ReactNode, useCallback, useEffect, useState } from "react";
import { Category } from "@/types/category";
import { Form, FormError } from "@/components/form";
import {
	Modal,
	ModalContainer,
	ModalHeader,
	ModalTitle,
	ModalBody,
} from "@/components/modal";
import { Input } from "@/components/input";
import { Button } from "@/components/button";
import { updateCategory } from "@/hooks/categories";

type EditCategoryModalProps = {
	isOpen: boolean;
	close: () => void;
	category: Category;
	updateData: () => Promise<void>;
};

export default function EditCategoryModal({
	isOpen,
	close,
	category,
	updateData,
}: EditCategoryModalProps): ReactNode {
	const [name, setName] = useState<string>("");
	const [errors, setErrors] = useState<FormError>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const isSubmitButtonDisabled = (): boolean => {
		return !name;
	};

	const handleUpdateCategory = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		await updateCategory(category.id, { name });
		await updateData();

		close();
	}, [setIsLoading, close, updateData, category, name]);

	useEffect(() => {
		if (!("name" in category)) {
			return;
		}

		setName(category.name);
	}, [category]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setIsLoading(false);
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} close={close}>
			<ModalContainer>
				<ModalHeader>
					<ModalTitle>Kategória szerkesztése</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Form
						errors={errors}
						setErrors={setErrors}
						handleSubmit={handleUpdateCategory}
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

						<Button
							fullWidth
							isLoading={isLoading}
							isDisabled={isSubmitButtonDisabled()}
						>
							Mentés
						</Button>
					</Form>
				</ModalBody>
			</ModalContainer>
		</Modal>
	);
}
