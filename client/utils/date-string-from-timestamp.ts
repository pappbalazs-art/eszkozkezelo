import { Timestamp } from "firebase/firestore";

export default function getDateStringFromTimestamp(timestamp: Timestamp) {
	return new Timestamp(timestamp.seconds, timestamp.nanoseconds)
		.toDate()
		.toLocaleDateString("hu-HU", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
}
