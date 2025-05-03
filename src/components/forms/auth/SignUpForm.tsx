// src/components/forms/auth/SignUpForm.tsx
import { useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { signUp } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { PasswordStrengthIndicator } from "@/components/forms/auth/PasswordStrengthIndicator";

export const SignUpForm = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [agreeToTerms, setAgreeToTerms] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const validateForm = () => {
		if (formData.password !== formData.confirmPassword) {
			toast.error("Passwords do not match");
			return false;
		}

		if (formData.password.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return false;
		}

		if (!/[A-Z]/.test(formData.password)) {
			toast.error("Password must contain at least one uppercase letter");
			return false;
		}

		if (!/[a-z]/.test(formData.password)) {
			toast.error("Password must contain at least one lowercase letter");
			return false;
		}

		if (!/[0-9]/.test(formData.password)) {
			toast.error("Password must contain at least one number");
			return false;
		}

		if (!/[^A-Za-z0-9]/.test(formData.password)) {
			toast.error("Password must contain at least one special character");
			return false;
		}

		if (!agreeToTerms) {
			toast.error("Please agree to the Terms and Conditions");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!validateForm()) return;

		setLoading(true);
		try {
			await signUp(
				formData.email,
				formData.password,
				formData.firstName,
				formData.lastName
			);
			toast.success("Account created successfully! Please verify your email.");
			navigate({ to: "/verify-email" });
		} catch (error: any) {
			toast.error(error.message || "Sign up failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="firstName" className="text-sm font-medium">
						First Name
					</Label>
					<Input
						id="firstName"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange}
						placeholder="John"
						required
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="lastName" className="text-sm font-medium">
						Last Name
					</Label>
					<Input
						id="lastName"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange}
						placeholder="Doe"
						required
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>
			</div>

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
						onFocus={() => setIsPasswordFocused(true)}
						onBlur={() => setIsPasswordFocused(false)}
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
				<PasswordStrengthIndicator
					password={formData.password}
					isFocused={isPasswordFocused}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword" className="text-sm font-medium">
					Confirm Password
				</Label>
				<div className="relative">
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type={showConfirmPassword ? "text" : "password"}
						value={formData.confirmPassword}
						onChange={handleChange}
						placeholder="••••••••"
						required
						className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
					>
						{showConfirmPassword ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</div>
			</div>

			<div className="flex items-center space-x-2">
				<Checkbox
					id="terms"
					checked={agreeToTerms}
					onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
					className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<Label htmlFor="terms" className="text-sm text-gray-600">
					I agree to the{" "}
					<Link
						to="/terms"
						className="text-blue-600 hover:text-blue-800 hover:underline"
					>
						Terms and Conditions
					</Link>
				</Label>
			</div>

			<Button
				type="submit"
				disabled={loading}
				className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
			>
				{loading ? "Creating Account..." : "Create Account"}
			</Button>

			<div className="text-center text-sm text-gray-600">
				Already have an account?{" "}
				<Link
					to="/login"
					className="text-blue-600 hover:text-blue-800 hover:underline"
				>
					Sign In
				</Link>
			</div>
		</form>
	);
};
