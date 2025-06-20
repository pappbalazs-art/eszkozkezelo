import { database } from "@/firebase";
import { CategoryDraft } from "@/types/category";
import { doc, updateDoc } from "firebase/firestore";

export default async function updateCategory(
	categoryId: string,
	category: CategoryDraft
): Promise<void> {
	await updateDoc(doc(database, "categories", categoryId), category);
}
