"use client";

import CategoriesTable from "./categories-table";
import { Spacer } from "@heroui/spacer";

export default function CategoriesPage() {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Kategóriák
			</h1>

			<Spacer y={5} />

			<CategoriesTable />
		</>
	);
}
