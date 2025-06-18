"use client";

import { ReactNode } from "react";
import withAdminAuth from "@/utils/with-admin-auth";
import { Container, ContainerTitle } from "@/components/container";

function ItemsPage(): ReactNode {
	return (
		<Container>
			<ContainerTitle>Eszközök</ContainerTitle>
		</Container>
	);
}

export default withAdminAuth(ItemsPage);
