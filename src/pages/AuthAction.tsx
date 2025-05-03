import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Route } from "@/routes/auth-action";
import { auth } from "@/lib/firebase-config.ts";
import { toast } from "sonner";
import { applyActionCode } from "firebase/auth";

export default function AuthAction() {
	const { mode, oobCode, continueUrl } = Route.useSearch();
	const navigate = useNavigate();
	const hasHandled = useRef(false);

	useEffect(() => {
		const handleAction = async () => {
			if (hasHandled.current) return;
			hasHandled.current = true;

			console.log("Mode:", mode);
			console.log("oobCode:", oobCode);
			console.log("continueUrl:", continueUrl);

			if (!mode || !oobCode) {
				console.log("Missing required parameters");
				toast.error("Invalid action link");
				navigate({ to: "/" });
				return;
			}

			try {
				switch (mode) {
					case "verifyEmail":
						await applyActionCode(auth, oobCode);
						toast.success("Email verified successfully!");
						// Use window.location for production to ensure full page reload
						if (import.meta.env.PROD) {
							window.location.href = "/email-confirmed";
						} else {
							navigate({ to: "/email-confirmed" });
						}
						break;
					case "resetPassword":
						console.log("Handling reset password");
						console.log(
							"Attempting to navigate to /reset-password with oobCode:",
							oobCode
						);

						// Try using window.location as a fallback
						try {
							navigate({
								to: "/reset-password",
								search: { mode, oobCode },
							});
							console.log("Navigation attempt completed");
						} catch (error) {
							console.error("Navigation error:", error);
							// Fallback to window.location
							window.location.href = `/reset-password?mode=${mode}&oobCode=${oobCode}`;
						}
						break;
					default:
						console.log("Invalid mode:", mode);
						toast.error("Invalid action mode");
						navigate({ to: "/" });
				}
			} catch (error: any) {
				console.error("Error:", error);
				toast.error(error.message || "Failed to process action");
				navigate({ to: "/" });
			}
		};

		handleAction();
	}, [mode, oobCode, continueUrl, navigate]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
			<div className="w-full max-w-md rounded-2xl shadow-lg p-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-300">
						Processing your request...
					</p>
				</div>
			</div>
		</div>
	);
}
