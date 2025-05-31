"use client";

import { ReactNode } from "react";
import withAuth from "@/utils/with-auth";

function CategoriesPage(): ReactNode {
	return <p>This is the catgeories page.</p>;
}

export default withAuth(CategoriesPage);
