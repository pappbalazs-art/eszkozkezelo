"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [userImpl, setUserImpl] = useState(null);
	const [user, setUser] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			if (user) {
				const usersRef = collection(database, "users");
				const userDataQuery = query(
					usersRef,
					where("user_uid", "==", user.uid)
				);
				const snapshot = await getDocs(userDataQuery);

				setUser(snapshot.docs[0].data());
				setIsAuthenticated(true);
			} else {
				setIsAuthenticated(false);
			}

			setUserImpl(user);
			setLoading(false);
		});

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
