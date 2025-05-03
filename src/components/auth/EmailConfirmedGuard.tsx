import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

interface EmailConfirmedGuardProps {
	children: React.ReactNode;
}

export function EmailConfirmedGuard({ children }: EmailConfirmedGuardProps) {
	const { user, isEmailVerified, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading) {
			// If not logged in, redirect to home
			if (!user) {
				console.log("No user found, redirecting to home");
				navigate({ to: "/" });
				return;
			}

			// If email is not verified, redirect to verify-email
			if (!isEmailVerified) {
				console.log("Email not verified, redirecting to verify-email");
				navigate({ to: "/verify-email" });
				return;
			}
		}
	}, [user, isEmailVerified, loading, navigate]);

	// Show loading state while checking auth
	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	// Only show children if user is logged in and email is verified
	if (user && isEmailVerified) {
		return <>{children}</>;
	}

	// Default to null while redirecting
	return null;
}
