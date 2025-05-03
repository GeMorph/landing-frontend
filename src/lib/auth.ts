import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	deleteUser,
	sendPasswordResetEmail,
	ActionCodeSettings,
	confirmPasswordReset,
} from "firebase/auth";
import { auth } from "./firebase-config";

const API_URL = import.meta.env["VITE_API_URL"] || "http://localhost:4000/api";

// Password validation helper
export function validatePassword(password: string): {
	isValid: boolean;
	message?: string;
} {
	if (password.length < 8) {
		return {
			isValid: false,
			message: "Password must be at least 8 characters long",
		};
	}
	if (!/[A-Z]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one uppercase letter",
		};
	}
	if (!/[a-z]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one lowercase letter",
		};
	}
	if (!/[0-9]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one number",
		};
	}
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one special character",
		};
	}
	return { isValid: true };
}

export async function signUp(
	email: string,
	password: string,
	firstName: string,
	lastName: string
) {
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
					firstName,
					lastName,
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

export async function resetPassword(email: string) {
	try {
		const actionCodeSettings: ActionCodeSettings = {
			url: `${window.location.origin}/reset-password`,
			handleCodeInApp: true,
		};

		await sendPasswordResetEmail(auth, email, actionCodeSettings);
	} catch (error: any) {
		throw new Error(error.message || "Failed to send password reset email");
	}
}

export async function confirmResetPassword(
	oobCode: string,
	newPassword: string
) {
	const validation = validatePassword(newPassword);
	if (!validation.isValid) {
		throw new Error(validation.message);
	}

	try {
		await confirmPasswordReset(auth, oobCode, newPassword);
	} catch (error: any) {
		throw new Error(error.message || "Failed to reset password");
	}
}
