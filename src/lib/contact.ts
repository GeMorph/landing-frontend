import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase-config";

interface ContactFormData {
	name: string;
	email: string;
	message: string;
}

export const submitContactForm = async (data: ContactFormData) => {
	try {
		const contactRef = collection(db, "contacts");
		await addDoc(contactRef, {
			...data,
			timestamp: new Date().toISOString(),
		});
		return { success: true };
	} catch (error) {
		console.error("Error submitting contact form:", error);
		throw error;
	}
};
