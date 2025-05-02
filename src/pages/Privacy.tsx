import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			damping: 12,
			stiffness: 100,
		},
	},
};

export const Privacy = () => {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="max-w-4xl mx-auto px-4 py-12"
		>
			<motion.div variants={itemVariants} className="text-center mb-12">
				<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-300 dark:to-gray-500 bg-clip-text text-transparent mb-4">
					Privacy Policy
				</h1>
				<p className="text-gray-500 dark:text-gray-400 text-lg">
					Last updated: {new Date().toLocaleDateString()}
				</p>
			</motion.div>

			<div className="space-y-8">
				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center mr-3">
							1
						</span>
						Information We Collect
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						We collect information that you provide directly to us, including
						your name, email address, and any other information you choose to
						provide.
					</p>
				</motion.section>

				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center mr-3">
							2
						</span>
						How We Use Your Information
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						We use the information we collect to provide, maintain, and improve
						our services, to communicate with you, and to protect our users.
					</p>
				</motion.section>

				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 flex items-center justify-center mr-3">
							3
						</span>
						Information Sharing
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						We do not share your personal information with third parties except
						as described in this privacy policy.
					</p>
				</motion.section>

				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 flex items-center justify-center mr-3">
							4
						</span>
						Data Security
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						We take reasonable measures to help protect your personal
						information from loss, theft, misuse, unauthorized access,
						disclosure, alteration, and destruction.
					</p>
				</motion.section>

				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 flex items-center justify-center mr-3">
							5
						</span>
						Your Rights
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						You have the right to access, correct, or delete your personal
						information. You can also object to our processing of your personal
						information.
					</p>
				</motion.section>

				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mr-3">
							6
						</span>
						Cookies
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						We use cookies and similar technologies to collect information about
						your browsing activities and to distinguish you from other users of
						our website.
					</p>
				</motion.section>

				<motion.section
					variants={itemVariants}
					className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
				>
					<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
						<span className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-300 flex items-center justify-center mr-3">
							7
						</span>
						Contact Us
					</h2>
					<p className="text-gray-600 dark:text-gray-300 leading-relaxed">
						If you have any questions about this Privacy Policy, please contact
						us at privacy@example.com.
					</p>
				</motion.section>
			</div>

			<motion.div variants={itemVariants} className="mt-8 flex justify-start">
				<Link
					to="/signup"
					className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 dark:from-gray-500 dark:to-gray-400 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
				>
					<svg
						className="w-5 h-5 mr-2"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M10 19l-7-7m0 0l7-7m-7 7h18"
						/>
					</svg>
					Back to Sign Up
				</Link>
			</motion.div>
		</motion.div>
	);
};
