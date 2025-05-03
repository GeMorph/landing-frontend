// src/components/forms/auth/SignInForm.tsx
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export const SignInForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await signIn(formData.email, formData.password, rememberMe);
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
			<div className="space-y-2">
				<Label htmlFor="email" className="text-sm font-medium">
					Email
				</Label>
				<Input
					id="email"
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					placeholder="john.doe@example.com"
					required
					className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password" className="text-sm font-medium">
					Password
				</Label>
				<div className="relative">
					<Input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"}
						value={formData.password}
						onChange={handleChange}
						placeholder="••••••••"
						required
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						{showPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<input
						type="checkbox"
						id="remember"
						checked={rememberMe}
						onChange={(e) => setRememberMe(e.target.checked)}
						className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<Label htmlFor="remember" className="text-sm text-gray-600">
						Remember me
					</Label>
				</div>
				<Link
					to="/forgot-password"
					className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
				>
					Forgot Password?
				</Link>
			</div>

			<Button
				type="submit"
				disabled={loading}
				className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
			>
				{loading ? "Signing in..." : "Sign In"}
			</Button>

			<div className="text-center text-sm text-gray-600">
				Don't have an account?{" "}
				<Link
					to="/signup"
					className="text-blue-600 hover:text-blue-800 hover:underline"
				>
					Create Account
				</Link>
			</div>
		</form>
	);
};
