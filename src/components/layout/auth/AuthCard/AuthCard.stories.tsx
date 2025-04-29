// src/components/layout/auth/AuthCard/AuthCard.stories.tsx
import { AuthCard } from "./AuthCard";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof AuthCard> = {
	component: AuthCard,
	title: "Layout/AuthCard",
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const Default: Story = {
	args: {
		title: "Sign In",
		children: (
			<form className="space-y-4">
				<input
					type="email"
					placeholder="Email"
					className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
				/>
				<input
					type="password"
					placeholder="Password"
					className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
				/>
				<button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
					Sign In
				</button>
			</form>
		),
	},
};
