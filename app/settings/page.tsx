"use client";

import { ReactNode } from "react";
import withAuth from "@/utils/with-auth";
import { Container } from "@/components/container";

function SettingsPage(): ReactNode {
	return <Container>This is the settings page.</Container>;
}

export default withAuth(SettingsPage);
