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

type AuthContextType = {
	userImpl: FirebaseUser | undefined | null;
	user: User | undefined;
	isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

type AuthProviderProps = {
	children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactNode => {
	const [userImpl, setUserImpl] = useState<FirebaseUser | undefined | null>(
		undefined
	);
	const [user, setUser] = useState<User | undefined>(undefined);
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);

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
