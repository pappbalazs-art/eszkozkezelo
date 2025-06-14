import clsx from "clsx";
import { createContext, ReactNode, useEffect, useRef, useState } from "react";

import "./dropdown.scss";
import { useClickOutside } from "@/utils/use-click-outside";

type DropdownContextType = {
	isMenuOpen: boolean;
	toggleMenu(): void;
	closeMenu(): void;
};

export const DropdownContext = createContext<DropdownContextType>(
	{} as DropdownContextType
);

type DropdownProps = {
	children: ReactNode;
};

export default function Dropdown({ children }: DropdownProps): ReactNode {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	const ref = useRef<HTMLDivElement>(null);

	const toggleMenu = (): void => {
		setIsMenuOpen(!isMenuOpen);
	};

	const closeMenu = (): void => {
		setIsMenuOpen(false);
	};

	useClickOutside(ref, closeMenu);

	useEffect(() => {
		const handleResize = (): void => {
			setIsMenuOpen(false);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<DropdownContext.Provider value={{ isMenuOpen, toggleMenu, closeMenu }}>
			<div className={clsx("dropdown", isMenuOpen && "open")} ref={ref}>
				{children}
			</div>
		</DropdownContext.Provider>
	);
}
