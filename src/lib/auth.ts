import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	deleteUser,
} from "firebase/auth";
import { auth } from "./firebase";

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

export async function signUp(email: string, password: string) {
	try {
		// Create user in Firebase first
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		// Get the ID token
		const token = await userCredential.user.getIdToken();

		try {
			// Create user in our backend
			const response = await fetch(`${API_URL}/user/signup`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Firebase-Token": token,
				},
				body: JSON.stringify({
					email,
					name: email.split("@")[0], // Default name from email
					firstName: "",
					lastName: "",
				}),
			});

			if (!response.ok) {
				// If backend creation fails, delete the Firebase user
				await deleteUser(userCredential.user);
				throw new Error("Failed to create user in backend");
			}

			return userCredential;
		} catch (error) {
			// If any error occurs during backend creation, delete the Firebase user
			await deleteUser(userCredential.user);
			throw error;
		}
	} catch (error: any) {
		throw new Error(error.message || "Failed to sign up");
	}
}

export async function signIn(email: string, password: string) {
	try {
		// Sign in with Firebase
		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);

		return userCredential;
	} catch (error: any) {
		throw new Error(error.message || "Failed to sign in");
	}
}

// Helper function to get auth token for API calls
export async function getAuthToken(): Promise<string | null> {
	const user = auth.currentUser;
	if (!user) return null;
	return user.getIdToken();
}

// Helper function to make authenticated API calls
export async function authenticatedFetch(
	url: string,
	options: RequestInit = {}
) {
	const token = await getAuthToken();
	if (!token) {
		throw new Error("No authentication token available");
	}

	const headers = {
		...options.headers,
		"Content-Type": "application/json",
		"X-Firebase-Token": token,
	};

	return fetch(url, {
		...options,
		headers,
	});
}
