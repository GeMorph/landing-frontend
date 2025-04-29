// src/routes/signup.tsx
import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/layout/auth/AuthCard";
import { SignUpForm } from "@/components/forms/auth";
import { Header } from "@/components/layout/main/Header/Header";

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
    <Header />
			<AuthCard title="Create an Account">
				<SignUpForm />
			</AuthCard>
		</>
	);
}
