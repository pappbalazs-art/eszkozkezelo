import { useCallback, useEffect, useState } from "react";

type UseDisclosureType = {
	isOpen: boolean;
	open: () => void;
	close: () => void;
};

export function useDisclosure(): UseDisclosureType {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const open = useCallback((): void => {
		if (isOpen) {
			return;
		}

		setIsOpen(true);
	}, [isOpen, setIsOpen]);

	const close = useCallback((): void => {
		console.log("close");

		if (!isOpen) {
			return;
		}

		setIsOpen(false);
	}, [isOpen, setIsOpen]);

	const closeOnEscapePress = useCallback(
		(event: globalThis.KeyboardEvent): void => {
			if (event.key !== "Escape") {
				return;
			}

			close();
		},
		[close]
	);

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("keydown", closeOnEscapePress, true);
		} else {
			document.removeEventListener("keydown", closeOnEscapePress, true);
		}

		return () => {
			document.removeEventListener("keydown", closeOnEscapePress, true);
		};
	}, [isOpen]);

	return { isOpen, open, close };
}
