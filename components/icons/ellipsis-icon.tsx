import { IconProps } from "@/types/icon-props";
import { ReactNode } from "react";

export default function EllipsisIcon({ size = 14 }: IconProps): ReactNode {
	return (
		<svg
			className="icon icon-ellipsis"
			height={size + "px"}
			aria-hidden="true"
			focusable="false"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512"
		>
			<path
				fill="currentColor"
				d="M8 256a56 56 0 1 1 112 0A56 56 0 1 1 8 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z"
			></path>
		</svg>
	);
}
