import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

type AuthCardProps = {
	title: string;
	children: React.ReactNode;
};

export const AuthCard: React.FC<AuthCardProps> = ({ title, children }) => {
	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
			<motion.div
				className={clsx(
					"w-full max-w-md rounded-2xl shadow-lg p-8",
					"bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
				)}
				initial={{ opacity: 0, scale: 0.95, y: 20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<motion.h2
					className="text-2xl font-bold mb-6 text-center"
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
				>
					{title}
				</motion.h2>
				{children}
			</motion.div>
		</div>
	);
};
