import { ReactElement, ReactNode, useContext } from "react";

import "./dropdown-menu-item.scss";
import { Color } from "@/types/color";
import clsx from "clsx";
import { DropdownContext } from "./dropdown";

type DropdownMenuItemProps = {
	color?: Color;
	onClick?: () => void;
	children: ReactNode;
};

export default function DropdownMenuItem({
	color,
	onClick,
	children,
}: DropdownMenuItemProps): ReactNode {
	const { closeMenu } = useContext(DropdownContext);

	return (
		<li
			className={clsx("dropdown__menu__item", color && "color-" + color)}
			onClick={() => {
				closeMenu();

				if (onClick) {
					onClick();
				}
			}}
		>
			{children}
		</li>
	);
}
