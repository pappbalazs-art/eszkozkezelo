import { User as FirebaseUser } from "firebase/auth";
import { User } from "./user";

export type AuthContextType = {
	userImpl: FirebaseUser | undefined | null;
	user: User | undefined;
	isAuthenticated: boolean;
};
