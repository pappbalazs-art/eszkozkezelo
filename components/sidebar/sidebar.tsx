import { ReactNode } from "react";
import SidebarWrapper from "./sidebar-wrapper";
import SidebarMenu from "./sidebar-menu";
import SidebarMenuItem from "./sidebar-menu-item";
import SidebarMenuLink from "./sidebar-menu-link";
import SidebarContainer from "./sidebar-container";
import {
	CategoriesIcon,
	HomeIcon,
	ItemsIcon,
	ReservationsIcon,
} from "../icons";

export default function Sidebar(): ReactNode {
	return (
		<SidebarWrapper>
			<SidebarContainer>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuLink href="/" icon={<HomeIcon />}>
							Kezdőlap
						</SidebarMenuLink>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuLink
							href="/categories"
							icon={<CategoriesIcon />}
						>
							Kategóriák
						</SidebarMenuLink>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuLink href="/items" icon={<ItemsIcon />}>
							Eszközök
						</SidebarMenuLink>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuLink
							href="/reservations"
							icon={<ReservationsIcon />}
						>
							Foglalások
						</SidebarMenuLink>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarContainer>
		</SidebarWrapper>
	);
}
