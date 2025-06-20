import { database } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export default async function deleteCategory(
	categoryId: string
): Promise<void> {
	await deleteDoc(doc(database, "categories", categoryId));
}
