"use client";

import ItemsTable from "./items-table";
import { Spacer } from "@heroui/spacer";

export default function ItemsPage() {
	return (
		<>
			<h1 className="tracking-tight inline font-bold text-3xl">
				Eszközök
			</h1>

			<Spacer y={5} />

			<ItemsTable />
		</>
	);
}
