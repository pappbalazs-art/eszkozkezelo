export type ItemDraft = {
	name: string;
	serial_number?: string;
	category_uid: string;
	description?: string;
	created_by: string;
};

export type Item = {
	id: string;
	name: string;
	serial_number?: string;
	category_uid: string;
	category_name?: string;
	description?: string;
	created_by: string;
};
