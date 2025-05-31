"use client";

import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth, database } from "@/firebase";
import { User } from "@/types/user";
import { AuthContextType } from "@/types/auth-context";

const AuthContext = createContext<AuthContextType>({
	userImpl: undefined,
	user: undefined,
	isAuthenticated: false,
});

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactNode => {
	const [userImpl, setUserImpl] = useState<FirebaseUser | undefined | null>(
		undefined
	);
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);
	const [loading, setLoading] = useState<Boolean>(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			async (user): Promise<void> => {
				if (user) {
					const usersRef = collection(database, "users");
					const userDataQuery = query(
						usersRef,
						where("user_uid", "==", user.uid)
					);
					const snapshot = await getDocs(userDataQuery);

					setUser({
						...snapshot.docs[0].data(),
						id: snapshot.docs[0].id,
					} as User);
					setIsAuthenticated(true);
				} else {
					setIsAuthenticated(false);
				}

				setUserImpl(user);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, []);

	return (
		!loading && (
			<AuthContext.Provider value={{ userImpl, user, isAuthenticated }}>
				{children}
			</AuthContext.Provider>
		)
	);
};

export const useAuth = () => useContext(AuthContext);
