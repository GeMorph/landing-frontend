import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { auth } from "@/lib/firebase-config";
import { onAuthStateChanged } from "firebase/auth";

interface AuthGuardProps {
	children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
	const navigate = useNavigate();

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (!user) {
				console.log("No authenticated user, redirecting to home");
				navigate({ to: "/" });
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	return <>{children}</>;
}
