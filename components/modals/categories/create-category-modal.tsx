import { ReactNode, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Form, FormError } from "@/components/form";
import { Input } from "@/components/input";
import {
	Modal,
	ModalContainer,
	ModalHeader,
	ModalTitle,
	ModalBody,
} from "@/components/modal";
import { createCategory } from "@/hooks/categories";

type CreateCategoryModalProps = {
	isOpen: boolean;
	close: () => void;
	updateData: () => Promise<void>;
};

export default function CreateCategoryModal({
	isOpen,
	close,
	updateData,
}: CreateCategoryModalProps): ReactNode {
	const [name, setName] = useState<string>("");
	const [errors, setErrors] = useState<FormError>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const isSubmitButtonDisabled = (): boolean => {
		return !name;
	};

	const handleCreateCategory = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		await createCategory({ name });
		await updateData();

		close();
	}, [setIsLoading, close, updateData, name]);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		setName("");
		setErrors({});
		setIsLoading(false);
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} close={close}>
			<ModalContainer>
				<ModalHeader>
					<ModalTitle>Kategória hozzáadása</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<Form
						errors={errors}
						setErrors={setErrors}
						handleSubmit={handleCreateCategory}
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
							Új kategória hozzáadása
						</Button>
					</Form>
				</ModalBody>
			</ModalContainer>
		</Modal>
	);
}
