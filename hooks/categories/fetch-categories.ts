import { database } from "@/firebase";
import { Category } from "@/types/category";
import { Hook } from "@/types/hook";
import {
	collection,
	getDocs,
	query,
	QueryDocumentSnapshot,
	where,
} from "firebase/firestore";

export default async function fetchCategories(): Promise<Hook<Category>> {
	const categoriesSnapshot = await getDocs(
		collection(database, "categories")
	);
	const categoriesData = await Promise.all(
		categoriesSnapshot.docs.map(
			async (doc: QueryDocumentSnapshot): Promise<Category> => {
				const itemsRef = collection(database, "items");
				const itemsQuery = query(
					itemsRef,
					where("category_uid", "==", doc.id)
				);
				const itemsSnapshot = await getDocs(itemsQuery);

				return {
					...doc.data(),
					length: itemsSnapshot.docs.length,
					id: doc.id,
				} as Category;
			}
		)
	);

	return {
		data: categoriesData,
		error: undefined,
	};
}
