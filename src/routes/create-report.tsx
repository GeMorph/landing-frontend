import { createFileRoute } from "@tanstack/react-router";
import CreateReport from "@/pages/CreateReport";
import { Header } from "@/components/layout/main/Header/Header";
import { EmailConfirmedGuard } from "@/components/auth/EmailConfirmedGuard";

export const Route = createFileRoute("/create-report")({
	component: () => (
		<EmailConfirmedGuard>
			<Header />
			<CreateReport />
		</EmailConfirmedGuard>
	),
});
