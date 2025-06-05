"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-context";

const withNoAuth = (WrappedComponent: FC): any => {
	const ComponentWithNoAuth = (props: any): ReactNode => {
		const { user } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (user) {
				router.push("/");
			}
		}, [user, router]);

		if (user) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};

	ComponentWithNoAuth.displayName = `withNoAuth(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return ComponentWithNoAuth;
};

export default withNoAuth;
