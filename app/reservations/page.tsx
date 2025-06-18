"use client";

import { ReactNode } from "react";
import withAdminAuth from "@/utils/with-admin-auth";
import { Container, ContainerTitle } from "@/components/container";

function ReservationsPage(): ReactNode {
	return (
		<Container>
			<ContainerTitle>Foglalások</ContainerTitle>
		</Container>
	);
}

export default withAdminAuth(ReservationsPage);
