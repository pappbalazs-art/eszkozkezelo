import { database } from "@/firebase";
import { CategoryDraft } from "@/types/category";
import { addDoc, collection } from "firebase/firestore";

export default async function createCategory(
	category: CategoryDraft
): Promise<void> {
	await addDoc(collection(database, "categories"), category);
}
