import { ReactNode } from "react";

import "./modal-container.scss";

type ModalContainerProps = {
	children: ReactNode;
};

export default function ModalContainer({
	children,
}: ModalContainerProps): ReactNode {
	return <div className="modal__container">{children}</div>;
}
