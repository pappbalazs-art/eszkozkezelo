import { database } from "@/firebase";
import { ItemDraft } from "@/types/item";
import { addDoc, collection } from "firebase/firestore";

export default async function createItem(item: ItemDraft): Promise<void> {
	await addDoc(collection(database, "items"), item);
}
