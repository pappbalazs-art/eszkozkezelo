import { IconProps } from "@/types/icon-props";
import { ReactNode } from "react";

export default function PlusIcon({
	size = 1,
	sizeUnit = "rem",
}: IconProps): ReactNode {
	return (
		<svg
			className="icon icon--plus"
			height={size + sizeUnit}
			aria-hidden="true"
			focusable="false"
			role="img"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 448 512"
		>
			<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"></path>
		</svg>
	);
}
