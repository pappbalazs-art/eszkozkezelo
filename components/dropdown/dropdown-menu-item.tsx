import { ReactNode, useContext } from "react";
import clsx from "clsx";
import { Color } from "@/types/color";
import { DropdownContext } from "./dropdown";

import "./dropdown-menu-item.scss";

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
