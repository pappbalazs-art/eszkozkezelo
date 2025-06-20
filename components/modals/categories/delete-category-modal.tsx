import { Button } from "@/components/button";
import {
	Modal,
	ModalBody,
	ModalContainer,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "@/components/modal";
import deleteCategory from "@/hooks/categories/delete-category";
import { Category } from "@/types/category";
import getArticleForWord from "@/utils/get-article-for-word";
import { ReactNode, useCallback, useEffect, useState } from "react";

type DeleteCategoryModalProps = {
	isOpen: boolean;
	close: () => void;
	category: Category;
	updateData: () => Promise<void>;
};

export default function DeleteCategoryModal({
	isOpen,
	close,
	category,
	updateData,
}: DeleteCategoryModalProps): ReactNode {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleDeleteCategory = useCallback(async (): Promise<void> => {
		setIsLoading(true);

		await deleteCategory(category.id);
		await updateData();

		close();
	}, [setIsLoading, close, updateData, category]);

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
					<ModalTitle>Kategória törlése</ModalTitle>
				</ModalHeader>
				<ModalBody>
					Biztos benne, hogy törli {getArticleForWord(category.name)}{" "}
					<b>{category.name}</b> kategóriát?
				</ModalBody>
				<ModalFooter>
					<Button
						color="danger"
						fullWidth
						isLoading={isLoading}
						onClick={handleDeleteCategory}
					>
						Törlés
					</Button>
				</ModalFooter>
			</ModalContainer>
		</Modal>
	);
}
