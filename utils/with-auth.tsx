"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-context";

const withAuth = (WrappedComponent: FC): any => {
	const ComponentWithAuth = (props: any): ReactNode => {
		const { isAuthenticated } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!isAuthenticated) {
				router.push("/sign-in");
			}
		}, [isAuthenticated, router]);

		if (!isAuthenticated) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};

	ComponentWithAuth.displayName = `withAuth(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return ComponentWithAuth;
};

export default withAuth;
