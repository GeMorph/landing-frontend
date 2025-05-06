import { ChevronRight } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "@tanstack/react-router";

export const Footer = () => {
	return (
		<footer className="w-full border-t bg-background text-foreground font-inter px-3 py-10">
			<div className="max-w-[80%] mx-auto grid grid-cols-1 md:grid-cols-[1fr_auto_auto] md:gap-x-6 lg:gap-x-10 gap-y-10">
				{/* Left column */}
				<div>
					<Link to="/" className="inline-block">
						<div className="flex items-center space-x-2 text-5xl font-bold mb-4">
							<img
								src="/logo-bright.png"
								alt="logo"
								className="h-6 md:h-8 lg:h-10 dark:hidden"
							/>
							<img
								src="/logo-dark.png"
								alt="logo-dark"
								className="h-6 md:h-8 lg:h-10 hidden dark:block"
							/>
							<div className="text-lg md:text-2xl lg:text-4xl text-foreground">
								GeMorph
							</div>
						</div>
					</Link>
					<p className="text-sm md:text-md lg:text-lg text-muted-foreground mb-6 leading-snug">
						Powered by AI. Informed by Genetics. Focused on the Future.
					</p>
					<h3 className="text-sm md:text-md lg:text-lg font-semibold mb-2">
						Follow Us
					</h3>
					<div className="flex gap-5">
						<a
							href="https://facebook.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-muted p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							<FaFacebookF className="text-xl text-[#1877F2]" />
						</a>
						<a
							href="https://instagram.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-muted p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							<FaInstagram className="text-xl text-[#E1306C]" />
						</a>
						<a
							href="https://linkedin.com"
							target="_blank"
							rel="noopener noreferrer"
							className="bg-muted p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
						>
							<FaLinkedinIn className="text-xl text-[#0A66C2]" />
						</a>
					</div>
				</div>

				{/* Quick Links column */}
				<div>
					<h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
						Quick Links
					</h2>
					<div className="space-y-4 text-lg">
						{[
							{ label: "Home", to: "/" },
							{ label: "About", to: "/#about" },
							{ label: "Services", to: "/#services" },
							{ label: "Contact", to: "/#contact" },
						].map((link, idx) => (
							<div key={idx} className="flex items-center space-x-3">
								<ChevronRight className="h-6 w-6" />
								<Link
									to={link.to}
									className="text-sm md:text-md lg:text-lg font-medium hover:text-primary transition-colors"
								>
									{link.label}
								</Link>
							</div>
						))}
					</div>
				</div>

				{/* Legal column */}
				<div>
					<h2 className="text-md md:text-lg lg:text-xl font-semibold mb-4">
						Legal
					</h2>
					<div className="space-y-4 text-lg">
						{[
							{ label: "Terms and Conditions", to: "/terms" },
							{ label: "Privacy Policy", to: "/privacy" },
						].map((link, idx) => (
							<div key={idx} className="flex items-center space-x-3">
								<ChevronRight className="h-6 w-6" />
								<Link
									to={link.to}
									onClick={() =>
										window.scrollTo({ top: 0, behavior: "smooth" })
									}
									className="text-sm md:text-md lg:text-lg font-medium hover:text-primary transition-colors"
								>
									{link.label}
								</Link>
							</div>
						))}
					</div>
				</div>
			</div>
			<div className="mt-10 text-center text-xs md:text-sm lg:text-base text-muted-foreground">
				© 2025, GeMorph. All rights reserved.
			</div>
		</footer>
	);
};
