import { ReactNode } from "react";
import { Color } from "@/types/color";
import clsx from "clsx";

import "./button.scss";

export type ButtonVariants = "solid";

type ButtonProps = {
	variant?: ButtonVariants;
	color?: Color;
	children: ReactNode;
};

export default function Button({
	variant = "solid",
	color = "primary",
	children,
}: ButtonProps): ReactNode {
	const getClassNames = (): string => {
		return clsx("button", "button--" + variant, "button--" + color);
	};

	return <button className={getClassNames()}>{children}</button>;
}
