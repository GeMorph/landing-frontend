import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth";
import { PasswordStrengthIndicator } from "@/components/forms/auth/PasswordStrengthIndicator";

export const SignUpForm = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [loading, setLoading] = useState(false);
	const [isPasswordFocused, setIsPasswordFocused] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long");
			return;
		}

		if (!/[A-Z]/.test(password)) {
			toast.error("Password must contain at least one uppercase letter");
			return;
		}

		if (!/[a-z]/.test(password)) {
			toast.error("Password must contain at least one lowercase letter");
			return;
		}

		if (!/[0-9]/.test(password)) {
			toast.error("Password must contain at least one number");
			return;
		}

		if (!/[^A-Za-z0-9]/.test(password)) {
			toast.error("Password must contain at least one special character");
			return;
		}

		setLoading(true);
		try {
			await signUp(email, password, firstName, lastName);
			toast.success("Account created successfully!");
			navigate({ to: "/" });
		} catch (error: any) {
			toast.error(error.message || "Failed to create account");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="firstName">First Name</Label>
					<Input
						id="firstName"
						type="text"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="lastName">Last Name</Label>
					<Input
						id="lastName"
						type="text"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="email">Email</Label>
				<Input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="password">Password</Label>
				<Input
					id="password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
					minLength={8}
					onFocus={() => setIsPasswordFocused(true)}
					onBlur={() => setIsPasswordFocused(false)}
				/>
				<PasswordStrengthIndicator
					password={password}
					isFocused={isPasswordFocused}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="confirmPassword">Confirm Password</Label>
				<Input
					id="confirmPassword"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					required
					minLength={8}
				/>
			</div>

			<Button
				type="submit"
				className="w-full bg-blue-600 hover:bg-blue-700"
				disabled={loading}
			>
				{loading ? "Creating account..." : "Create Account"}
			</Button>
		</form>
	);
};
