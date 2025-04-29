// src/components/forms/auth/SignInForm.tsx
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { signIn } from "@/lib/auth";

export const SignInForm = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await signIn(email, password);
			toast.success("Signed in successfully!");
			navigate({ to: "/" });
		} catch (error: any) {
			toast.error(error.message || "Sign in failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="w-full p-2 border rounded dark:bg-gray-800"
				placeholder="Email"
				required
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="w-full p-2 border rounded dark:bg-gray-800"
				placeholder="Password"
				required
			/>
			<button
				type="submit"
				disabled={loading}
				className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
			>
				{loading ? "Signing in..." : "Sign In"}
			</button>
		</form>
	);
};
