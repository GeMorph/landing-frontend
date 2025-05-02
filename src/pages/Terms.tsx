import { Link } from "@tanstack/react-router";

export const Terms = () => {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
			<div className="prose max-w-none">
				<p>Last updated: {new Date().toLocaleDateString()}</p>
				<h2>1. Introduction</h2>
				<p>
					Welcome to our platform. By using our service, you agree to these
					terms. Please read them carefully.
				</p>
				<h2>2. Using our Services</h2>
				<p>
					You must follow any policies made available to you within the
					Services. You may use our Services only as permitted by law.
				</p>
				<h2>3. Privacy and Copyright Protection</h2>
				<p>
					Our privacy policies explain how we treat your personal data and
					protect your privacy when you use our Services.
				</p>
				<h2>4. Your Content in our Services</h2>
				<p>
					Some of our Services allow you to upload, submit, store, send or
					receive content. You retain ownership of any intellectual property
					rights that you hold in that content.
				</p>
			</div>
			<div className="mt-8">
				<Link
					to="/signup"
					className="text-blue-600 hover:underline dark:text-blue-400"
				>
					← Back to Sign Up
				</Link>
			</div>
		</div>
	);
};
