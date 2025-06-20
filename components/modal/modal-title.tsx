import { ReactNode } from "react";

import "./modal-title.scss";

type ModalTitleProps = {
	children: string;
};

export default function ModalTitle({ children }: ModalTitleProps): ReactNode {
	return <div className="modal__title">{children}</div>;
}
