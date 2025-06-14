import { RefObject, useEffect } from "react";

export const useClickOutside = (
	ref: RefObject<HTMLElement | null | undefined>,
	callback: () => void
): void => {
	const handleClick = (event: MouseEvent): void => {
		if (ref.current && !ref.current.contains(event.target as HTMLElement)) {
			callback();
		}
	};

	useEffect(() => {
		document.addEventListener("click", handleClick);

		return () => {
			document.removeEventListener("click", handleClick);
		};
	}, []);
};
