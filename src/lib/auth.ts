import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	confirmPasswordReset,
	signOut,
	sendEmailVerification,
	updateProfile,
	setPersistence,
	browserLocalPersistence,
	browserSessionPersistence,
	deleteUser,
} from "firebase/auth";
import { auth, actionCodeSettings } from "./firebase-config";
import axios from "axios";

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
	let firebaseUser = null;
	try {
		console.log("Starting signup process...");
		// Create user in Firebase
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);
		firebaseUser = userCredential.user;
		console.log("Firebase user created:", firebaseUser.uid);

		// Update profile with name
		await updateProfile(firebaseUser, {
			displayName: `${firstName} ${lastName}`,
		});
		console.log("Profile updated with name");

		// Send verification email with action code settings
		await sendEmailVerification(firebaseUser, actionCodeSettings);
		console.log("Verification email sent");

		// Get the Firebase ID token
		const idToken = await firebaseUser.getIdToken();
		console.log("Got Firebase ID token");

		// Create user in our backend
		console.log("Attempting to create user in backend...");
		const response = await axios.post(
			`${API_URL}/user/signup`,
			{
				email,
				firstName,
				lastName,
			},
			{
				headers: {
					"X-Firebase-Token": idToken,
				},
			}
		);
		console.log("Backend user created:", response.data);

		return firebaseUser;
	} catch (error: any) {
		console.error("Error in signUp:", error);

		// If we created a Firebase user but backend failed, delete the Firebase user
		if (firebaseUser) {
			try {
				console.log("Deleting Firebase user due to backend failure...");
				await deleteUser(firebaseUser);
				console.log("Firebase user deleted successfully");
			} catch (deleteError) {
				console.error("Failed to delete Firebase user:", deleteError);
			}
		}

		throw new Error(error.message);
	}
}

export async function signIn(
	email: string,
	password: string,
	rememberMe: boolean = false
) {
	try {
		// Set persistence based on remember me
		await setPersistence(
			auth,
			rememberMe ? browserLocalPersistence : browserSessionPersistence
		);

		const userCredential = await signInWithEmailAndPassword(
			auth,
			email,
			password
		);
		return userCredential.user;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function logout() {
	try {
		await signOut(auth);
	} catch (error: any) {
		throw new Error(error.message);
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
		await sendPasswordResetEmail(auth, email);
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function resendVerificationEmail() {
	try {
		const user = auth.currentUser;
		if (!user) {
			throw new Error("No user is currently signed in");
		}
		await sendEmailVerification(user);
	} catch (error: any) {
		throw new Error(error.message);
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
