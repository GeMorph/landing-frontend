import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
	children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { user, isEmailVerified } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate({ to: "/login" });
			return;
		}

		if (!isEmailVerified) {
			navigate({ to: "/verify-email" });
			return;
		}
	}, [user, isEmailVerified, navigate]);

	if (!user || !isEmailVerified) {
		return null;
	}

	return <>{children}</>;
}
