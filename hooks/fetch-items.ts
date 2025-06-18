import { database } from "@/firebase";
import { Hook } from "@/types/hook";
import { Item } from "@/types/item";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";

export default async function fetchItems(): Promise<Hook<Item>> {
	const itemsSnapshot = await getDocs(collection(database, "items"));
	const itemsData = itemsSnapshot.docs.map(
		(doc: QueryDocumentSnapshot): Item => {
			return { ...doc.data(), id: doc.id } as Item;
		}
	);

	return {
		data: itemsData,
		error: undefined,
	};
}
