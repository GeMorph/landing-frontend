import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: import.meta.env["VITE_FIREBASE_API_KEY"],
	authDomain: import.meta.env["VITE_FIREBASE_AUTH_DOMAIN"],
	projectId: import.meta.env["VITE_FIREBASE_PROJECT_ID"],
	storageBucket: import.meta.env["VITE_FIREBASE_STORAGE_BUCKET"],
	messagingSenderId: import.meta.env["VITE_FIREBASE_MESSAGING_SENDER_ID"],
	appId: import.meta.env["VITE_FIREBASE_APP_ID"],
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure language
auth.useDeviceLanguage();

// Configure action code settings for email verification
const actionCodeSettings = {
	url: import.meta.env.PROD
		? "http://gemorph-frontend-s3-bucket.s3-website-us-east-1.amazonaws.com/auth-action" // Replace with your actual domain
		: "http://localhost:5172/auth-action",
	handleCodeInApp: true,
};

export { actionCodeSettings };
