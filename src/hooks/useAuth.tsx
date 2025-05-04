import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
} from "react";
import {
	User,
	onAuthStateChanged,
	signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase-config";

type AuthContextType = {
	user: User | null;
	loading: boolean;
	isEmailVerified: boolean;
	signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(
			auth,
			(firebaseUser: User | null) => {
				setUser(firebaseUser);
				setLoading(false);
			}
		);

		return () => unsubscribe();
	}, []);

	const signOut = async () => {
		try {
			await firebaseSignOut(auth);
		} catch (error) {
			console.error("Error signing out:", error);
			throw error;
		}
	};

	const value = {
		user,
		loading,
		isEmailVerified: user?.emailVerified ?? false,
		signOut,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
