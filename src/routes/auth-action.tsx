import { createFileRoute } from "@tanstack/react-router";
import AuthAction from "@/pages/AuthAction";

export const Route = createFileRoute("/auth-action")({
	validateSearch: (search: Record<string, unknown>) => {
		// Handle Firebase action URL parameters
		const mode = search["mode"] as string;
		const oobCode = search["oobCode"] as string;
		const apiKey = search["apiKey"] as string;
		const continueUrl = search["continueUrl"] as string;
		const lang = search["lang"] as string;

		return {
			mode,
			oobCode,
			apiKey,
			continueUrl,
			lang,
		};
	},
	component: AuthAction,
});
