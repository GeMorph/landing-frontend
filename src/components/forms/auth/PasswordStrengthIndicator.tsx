import { useEffect, useState } from "react";

type PasswordStrength = {
	score: number;
	message: string;
	color: string;
};

type PasswordStrengthIndicatorProps = {
	password: string;
	isFocused: boolean;
};

export function PasswordStrengthIndicator({
	password,
}: PasswordStrengthIndicatorProps) {
	const [strength, setStrength] = useState<PasswordStrength>({
		score: 0,
		message: "Too weak",
		color: "bg-red-500",
	});

	useEffect(() => {
		let score = 0;
		let message = "Too weak";
		let color = "bg-red-500";

		if (password.length >= 8) score += 1;
		if (/[A-Z]/.test(password)) score += 1;
		if (/[a-z]/.test(password)) score += 1;
		if (/[0-9]/.test(password)) score += 1;
		if (/[^A-Za-z0-9]/.test(password)) score += 1;

		switch (score) {
			case 0:
				message = "Too weak";
				color = "bg-red-500";
				break;
			case 1:
				message = "Weak";
				color = "bg-red-500";
				break;
			case 2:
				message = "Fair";
				color = "bg-yellow-500";
				break;
			case 3:
				message = "Good";
				color = "bg-blue-500";
				break;
			case 4:
				message = "Strong";
				color = "bg-green-500";
				break;
			case 5:
				message = "Very strong";
				color = "bg-green-600";
				break;
		}

		setStrength({ score, message, color });
	}, [password]);

	if (!password) return null;

	return (
		<div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
			<div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
				<div
					className={`h-full transition-all duration-500 ease-out ${strength.color}`}
					style={{
						width: `${(strength.score / 5) * 100}%`,
						transition:
							"width 500ms cubic-bezier(0.4, 0, 0.2, 1), background-color 500ms ease-in-out",
					}}
				/>
			</div>
			<p
				className={`text-sm transition-colors duration-500 ${strength.color.replace("bg", "text")}`}
			>
				{strength.message}
			</p>
		</div>
	);
}
