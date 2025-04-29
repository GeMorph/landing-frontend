// src/components/layout/auth/AuthCard/AuthCard.tsx
import React from "react";
import clsx from "clsx";

type AuthCardProps = {
	title: string;
	children: React.ReactNode;
};

export const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
			<div
				className={clsx(
					"w-full max-w-md rounded-2xl shadow-lg p-8",
					"bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
				)}
			>
				<h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
				{children}
			</div>
		</div>
	);
};
