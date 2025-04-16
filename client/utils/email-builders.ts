import getDateStringFromTimestamp from "./date-string-from-timestamp";

export const buildReserveEmailMessageForUser = (
	fromTimestamp: any,
	toTimeStamp: any,
	categoryList: any,
	selectedItems: any
) => {
	const emailContainerNode = document.createElement("div");
	emailContainerNode.style.width = "100%";
	emailContainerNode.style.maxWidth = "600px";
	emailContainerNode.style.margin = "0 auto";

	const messageNode = document.createElement("p");
	messageNode.style.fontSize = "2rem";
	messageNode.style.lineHeight = "2rem";
	messageNode.style.fontWeight = "800";

	const messageTextNode = document.createTextNode(
		"Új eszközfoglalást adtál le!"
	);
	messageNode.appendChild(messageTextNode);

	emailContainerNode.appendChild(messageNode);

	const detailsNode = document.createElement("div");
	detailsNode.style.backgroundColor = "#ffffff";
	detailsNode.style.padding = "30px";
	detailsNode.style.margin = "15px 0 35px";
	detailsNode.style.borderRadius = "15px";

	const detailsReservationTimeContainerNode = document.createElement("div");
	const detailsReservationTimeLabelNode = document.createElement("span");
	detailsReservationTimeLabelNode.style.fontWeight = "600";

	const detailsReservationTimeLabelTextNode = document.createTextNode(
		"Foglalás időtartalma"
	);
	detailsReservationTimeLabelNode.appendChild(
		detailsReservationTimeLabelTextNode
	);

	const detailsReservationTimeNode = document.createElement("div");
	const detailsReservationTimeTextNode = document.createTextNode(
		getDateStringFromTimestamp(fromTimestamp) +
			" – " +
			getDateStringFromTimestamp(toTimeStamp)
	);
	detailsReservationTimeNode.appendChild(detailsReservationTimeTextNode);

	detailsReservationTimeContainerNode.appendChild(
		detailsReservationTimeLabelNode
	);
	detailsReservationTimeContainerNode.appendChild(detailsReservationTimeNode);

	detailsNode.appendChild(detailsReservationTimeContainerNode);
	emailContainerNode.appendChild(detailsNode);

	const itemsContainerNode = document.createElement("div");

	categoryList.map((category: any) => {
		const itemsInCategory = selectedItems.filter(
			(item: any) => item.category_uid === category.id
		);

		if (itemsInCategory.length > 0) {
			const categoryNode = document.createElement("div");

			const categoryNameNode = document.createElement("span");
			categoryNameNode.style.fontSize = "1.5rem";
			categoryNameNode.style.fontWeight = "600";

			const categoryNameTextNode = document.createTextNode(category.name);
			categoryNameNode.appendChild(categoryNameTextNode);

			const itemListNode = document.createElement("ul");
			itemListNode.style.listStyle = "none";
			itemListNode.style.padding = "0";
			itemListNode.style.margin = "10px 0 35px";

			itemsInCategory.map((item: any) => {
				const itemNode = document.createElement("li");
				const itemTextNode = document.createTextNode(item.name);
				itemNode.appendChild(itemTextNode);

				itemListNode.appendChild(itemNode);
			});

			categoryNode.appendChild(categoryNameNode);
			categoryNode.appendChild(itemListNode);

			itemsContainerNode.appendChild(categoryNode);
		}
	});

	emailContainerNode.appendChild(itemsContainerNode);

	return emailContainerNode.outerHTML;
};
