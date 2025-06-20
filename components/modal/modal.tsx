import { ReactNode } from "react";
import clsx from "clsx";

import "./modal.scss";

type ModalProps = {
	isOpen: boolean;
	close: () => void;
	children: ReactNode;
};

export default function Modal({
	isOpen,
	close,
	children,
}: ModalProps): ReactNode {
	return (
		<div className={clsx("modal__wrapper", isOpen && "open")}>
			<div className="modal__background" onClick={close}></div>
			{children}
		</div>
	);
}
