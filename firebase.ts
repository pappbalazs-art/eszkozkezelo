import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { firebaseConfig } from "./config/firebase.config";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const database = getFirestore(app);

export default app;
