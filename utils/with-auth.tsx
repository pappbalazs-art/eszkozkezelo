"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-context";

const withAuth = (WrappedComponent: FC): any => {
	const ComponentWithAuth = (props: any): ReactNode => {
		const { user } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!user) {
				router.push("/sign-in");
			}
		}, [user, router]);

		if (!user) {
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
