import { FirebaseError } from "firebase/app";

export type Hook<T> = {
	data: Array<T>;
	error: FirebaseError | undefined;
};
