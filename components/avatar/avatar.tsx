import { ReactNode } from "react";

import "./avatar.scss";

type AvatarProps = {
	initials: string;
};

export default function Avatar({ initials }: AvatarProps): ReactNode {
	return <span className="avatar">{initials}</span>;
}
