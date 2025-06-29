import { database } from "@/firebase";
import { Category } from "@/types/category";
import { Hook } from "@/types/hook";
import { Item } from "@/types/item";
import {
	collection,
	doc,
	getDocs,
	QueryDocumentSnapshot,
} from "firebase/firestore";

export default async function fetchItems(): Promise<Hook<Item>> {
	const categoriesSnapshot = await getDocs(
		collection(database, "categories")
	);
	const categoriesData = categoriesSnapshot.docs.map(
		(doc: QueryDocumentSnapshot): Category => {
			return {
				...doc.data(),
				id: doc.id,
			} as Category;
		}
	);

	const itemsSnapshot = await getDocs(collection(database, "items"));
	const itemsData = itemsSnapshot.docs.map(
		(doc: QueryDocumentSnapshot): Item => {
			const itemCategory = categoriesData.filter(
				(category: Category): boolean =>
					category.id === doc.data().category_uid
			)[0];

			return {
				...doc.data(),
				id: doc.id,
				serial_number: doc.data()?.serial_number || "–",
				category_name: itemCategory?.name || "–",
			} as Item;
		}
	);

	return {
		data: itemsData,
		error: undefined,
	};
}
