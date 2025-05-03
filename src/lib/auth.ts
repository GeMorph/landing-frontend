import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	sendPasswordResetEmail,
	confirmPasswordReset,
	signOut,
	sendEmailVerification,
	updateProfile,
} from "firebase/auth";
import { auth } from "./firebase-config";

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
		const userCredential = await createUserWithEmailAndPassword(
			auth,
			email,
			password
		);

		// Update profile with name
		await updateProfile(userCredential.user, {
			displayName: `${firstName} ${lastName}`,
		});

		// Send verification email
		await sendEmailVerification(userCredential.user);

		return userCredential.user;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

export async function signIn(email: string, password: string) {
	try {
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
