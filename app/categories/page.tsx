"use client";

import { ReactNode } from "react";
import withAdminAuth from "@/utils/with-admin-auth";

function CategoriesPage(): ReactNode {
	return <p>This is the catgeories page.</p>;
}

export default withAdminAuth(CategoriesPage);
