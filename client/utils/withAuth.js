import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/AuthContext";

const withAuth = (WrappedComponent) => {
	const ComponentWithAuth = (props) => {
		const { user } = useAuth();
		const router = useRouter();

		useEffect(() => {
			if (!user) {
				router.replace("/sign-in");
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
