"use client";

import { FC, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-context";

const withAdminAuth = (WrappedComponent: FC): any => {
	const ComponentWithAdminAuth = (props: any): ReactNode => {
		const { user } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!user || user?.role !== "admin") {
				router.push("/");
			}
		}, [user, router]);

		if (!user) {
			return null;
		}

		return <WrappedComponent {...props} />;
	};

	ComponentWithAdminAuth.displayName = `withAdminAuth(${
		WrappedComponent.displayName || WrappedComponent.name || "Component"
	})`;

	return ComponentWithAdminAuth;
};

export default withAdminAuth;
