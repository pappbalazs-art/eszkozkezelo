import { MouseEventHandler, ReactNode } from "react";
import { Color } from "@/types/color";
import clsx from "clsx";

import "./button.scss";
import { Spinner } from "../spinner";

type ButtonVariants = "solid";
type ButtonProps = {
	variant?: ButtonVariants;
	color?: Color;
	fullWidth?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
};

export default function Button({
	variant = "solid",
	color = "primary",
	fullWidth = false,
	isDisabled = false,
	isLoading = false,
	onClick,
	children,
}: ButtonProps): ReactNode {
	const getClassNames = (): string => {
		return clsx(
			"button",
			"button--" + variant,
			"button--" + color,
			fullWidth && "button--full-width"
		);
	};

	return (
		<button
			className={getClassNames()}
			type="submit"
			disabled={isDisabled}
			onClick={onClick}
		>
			<div className="button__container">
				{isLoading && <Spinner />}
				{children}
			</div>
		</button>
	);
}
