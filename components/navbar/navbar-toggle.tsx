import { ReactNode, useContext } from "react";
import { NavbarContext } from "./navbar";

import "./navbar-toggle.scss";

export default function NavbarToggle(): ReactNode {
	const { toggleMenu } = useContext(NavbarContext);

	return (
		<button className="navbar__toggle" onClick={toggleMenu}>
			<span className="navbar__toggle__line--top"></span>
			<span className="navbar__toggle__line--middle"></span>
			<span className="navbar__toggle__line--bottom"></span>
		</button>
	);
}
