"use client";

import { AuthProvider } from "@/providers/auth-context";
import { ReactNode, useEffect, useState } from "react";

interface DynamicProps {
	children: ReactNode;
}

const Dynamic = ({ children }: DynamicProps): ReactNode => {
	const [hasMounted, setHasMounted] = useState<Boolean>(false);

	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	return <>{children}</>;
};

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactNode {
	return (
		<AuthProvider>
			<Dynamic>{children}</Dynamic>
		</AuthProvider>
	);
}
