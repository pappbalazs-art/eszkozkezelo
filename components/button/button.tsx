import { MouseEventHandler, ReactNode } from "react";
import { Color } from "@/types/color";
import clsx from "clsx";

import "./button.scss";
import { Spinner } from "../spinner";

type ButtonVariants = "solid";
type ButtonSizes = "default" | "compact";
type ButtonProps = {
	variant?: ButtonVariants;
	size?: ButtonSizes;
	color?: Color;
	fullWidth?: boolean;
	startContent?: ReactNode;
	isDisabled?: boolean;
	isLoading?: boolean;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
};

export default function Button({
	variant = "solid",
	size = "default",
	color = "primary",
	fullWidth = false,
	startContent,
	isDisabled = false,
	isLoading = false,
	onClick,
	children,
}: ButtonProps): ReactNode {
	const getClassNames = (): string => {
		return clsx(
			"button",
			"button--" + variant,
			"button--" + size,
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
				{startContent}
				{children}
			</div>
		</button>
	);
}
