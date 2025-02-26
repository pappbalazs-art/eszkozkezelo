"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CookiesProvider } from "react-cookie";
import { AuthProvider } from "../AuthContext";

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NonNullable<
			Parameters<ReturnType<typeof useRouter>["push"]>[1]
		>;
	}
}

const Dynamic = ({ children }: { children: React.ReactNode }) => {
	const [hasMounted, setHasMounted] = React.useState(false);

	React.useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) {
		return null;
	}

	return <>{children}</>;
};

export function Providers({ children, themeProps }: ProvidersProps) {
	const router = useRouter();

	return (
		<CookiesProvider>
			<HeroUIProvider navigate={router.push}>
				<NextThemesProvider {...themeProps}>
					<AuthProvider>
						<Dynamic>{children}</Dynamic>
					</AuthProvider>
				</NextThemesProvider>
			</HeroUIProvider>
		</CookiesProvider>
	);
}
