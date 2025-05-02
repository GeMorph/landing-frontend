import { useEffect, useState } from "react";
import { Header } from "../components/layout/main/Header/Header";
import { Footer } from "../components/layout/main/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { features, services } from "@/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [imagesLoaded, setImagesLoaded] = useState(0);
	const totalImages = 8; // Total number of images to load

	useEffect(() => {
		const handleImageLoad = () => {
			setImagesLoaded((prev) => {
				const newCount = prev + 1;
				if (newCount === totalImages) {
					setIsLoading(false);
				}
				return newCount;
			});
		};

		// Preload images
		const imageUrls = [
			"hero7.png",
			"hero6.png",
			"dnatoface.png",
			"whygemorph2.png",
			...features.map((f) => [f.srcLight, f.srcDark]).flat(),
			...services.map((s) => [s.srcLight, s.srcDark]).flat(),
		];

		imageUrls.forEach((url) => {
			const img = new Image();
			img.src = url;
			img.onload = handleImageLoad;
		});
	}, []);

	const sectionVariants = {
		hidden: { opacity: 0, y: 30 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				damping: 20,
				stiffness: 100,
				duration: 0.8,
			},
		},
	};

	const contactVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				damping: 15,
				stiffness: 100,
				duration: 0.8,
			},
		},
	};

	const featureVariants = {
		hidden: { opacity: 0, y: 50 },
		show: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.2,
				duration: 0.6,
				type: "spring",
				stiffness: 50,
			},
		}),
	};

	const fullText = "Giving a Face to Every DNA";
	const [displayedText, setDisplayedText] = useState("");
	const [showButton, setShowButton] = useState(false);

	const [showHeader, setShowHeader] = useState(true);
	const [lastScrollY, setLastScrollY] = useState(0);

	// Typing animation
	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			setDisplayedText(fullText.slice(0, i + 1));
			i++;
			if (i === fullText.length) {
				clearInterval(interval);
				setTimeout(() => setShowButton(true), 500);
			}
		}, 70);

		return () => clearInterval(interval);
	}, []);

	// Scroll-based header visibility
	useEffect(() => {
		const handleScroll = () => {
			const currentY = window.scrollY;

			if (Math.abs(currentY - lastScrollY) < 5) return;

			if (currentY > lastScrollY) {
				setShowHeader(false); // scrolling down
			} else {
				setShowHeader(true); // scrolling up
			}
			setLastScrollY(currentY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [lastScrollY]);

	if (isLoading) {
		return (
			<div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-950">
				<div className="text-center">
					<div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-300">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col min-h-screen transition-all duration-300 bg-white dark:bg-gray-950">
			<style>
				{`
					:root {
						--bg-color: rgb(249 250 251);
					}
					.dark {
						--bg-color: rgb(17 24 39);
					}
				`}
			</style>
			<motion.div
				initial={{ y: 0 }}
				animate={{ y: showHeader ? 0 : -100 }}
				viewport={{ once: true }}
				transition={{ duration: 0.3 }}
				className="fixed top-0 left-0 w-full z-50"
			>
				<Header />
			</motion.div>
			<main className="flex-grow">
				<section className="relative w-full h-screen overflow-hidden">
					{/* Light Mode Image */}
					<img
						src="hero7.png"
						loading="lazy"
						className="absolute inset-0 w-full h-full object-cover dark:hidden"
						alt="Hero Light"
					/>
					{/* Dark Mode Image */}
					<img
						src="hero6.png"
						loading="lazy"
						className="absolute inset-0 w-full h-full object-cover hidden dark:block"
						alt="Hero Dark"
					/>

					{/* Overlay */}
					<div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
						{/* Heading Animation */}
						<motion.h1
							className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mt-32"
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
							viewport={{ once: false }}
							transition={{ duration: 1 }}
						>
							{displayedText}
						</motion.h1>

						{/* Button Animation */}
						<AnimatePresence>
							{showButton && (
								<motion.button
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									transition={{ delay: 0.5, duration: 0.8 }}
									className="mt-6 px-6 py-3 bg-white text-black dark:bg-blue-900 dark:text-white rounded-md text-lg font-semibold hover:bg-gray-200 dark:hover:bg-blue-700 transition"
								>
									Get Started
								</motion.button>
							)}
						</AnimatePresence>
					</div>
				</section>
				<section
					id="about"
					className="w-full bg-white dark:bg-gray-950 text-foreground font-inter px-4 md:px-8 lg:px-16 xl:px-20 py-16 md:py-20"
				>
					<motion.div
						variants={sectionVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="max-w-[90%] md:max-w-[80%] mx-auto"
					>
						<div className="flex flex-center items-center justify-center mb-12">
							<h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent max-w-3xl mx-auto text-center">
								What makes Gemorph Unique
							</h2>
						</div>
						<div className="grid md:grid-cols-2 gap-6 md:gap-10 items-center">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, ease: "easeOut" }}
							>
								<p className="text-gray-600 dark:text-gray-300 mb-4">
									Lorem ipsum dolor sit amet, consectetur adipiscing elit.
									Aenean commodo ligula eget dolor. Aenean massa. Cum sociis
									natoque penatibus et magnis dis parturient montes, nascetur
									ridiculus mus.
								</p>
								<p className="text-gray-600 dark:text-gray-300">
									Donec quam felis, ultricies nec, pellentesque eu, pretium
									quis, sem. Nulla consequat massa quis enim.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, x: 50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, ease: "easeOut" }}
								className="relative flex justify-center"
							>
								<img
									src="/dnatoface.png"
									loading="lazy"
									alt="Illustration"
									className="w-[400px] h-auto dark:hidden"
								/>
								<img
									src="/whygemorph2.png"
									loading="lazy"
									alt="Illustration"
									className="w-[500px] h-auto hidden dark:block"
								/>
							</motion.div>
						</div>
					</motion.div>
				</section>

				<section
					id="services"
					className="py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-20 bg-gray-50 dark:bg-gray-900"
				>
					<motion.div
						variants={sectionVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="max-w-7xl mx-auto"
					>
						<div className="flex flex-center items-center justify-center mb-12">
							<h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent max-w-3xl mx-auto text-center">
								Our Commitment to Excellence
							</h2>
						</div>
						<div className="grid gap-16 md:grid-cols-1 lg:grid-cols-3">
							{features.map((feature, index) => (
								<motion.div
									key={index}
									variants={featureVariants}
									initial="hidden"
									whileInView="show"
									viewport={{ once: true }}
									custom={index}
									className="flex flex-col items-center text-center"
								>
									<img
										src={feature.srcLight}
										loading="lazy"
										alt={feature.title}
										className="h-48 mb-6 block dark:hidden"
									/>
									<img
										src={feature.srcDark}
										loading="lazy"
										alt={feature.title}
										className="h-48 mb-6 hidden dark:block"
									/>
									<h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-black dark:text-white mb-2">
										{feature.title}
									</h3>
									<p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xs">
										{feature.description}
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</section>
				<section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-20 bg-white dark:bg-gray-950">
					<motion.div
						variants={sectionVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="max-w-7xl mx-auto"
					>
						<div className="flex flex-center items-center justify-center mb-12">
							<h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent max-w-3xl mx-auto text-center">
								Genomic Intelligence at Work
							</h2>
						</div>
						<div className="grid gap-16 md:grid-cols-1 lg:grid-cols-3">
							{services.map((feature, index) => (
								<motion.div
									key={index}
									variants={featureVariants}
									initial="hidden"
									whileInView="show"
									viewport={{ once: true }}
									custom={index}
									className="flex flex-col items-center text-center"
								>
									<img
										src={feature.srcLight}
										loading="lazy"
										alt={feature.title}
										className="h-48 w-80 mb-6 block dark:hidden rounded-md"
									/>
									<img
										src={feature.srcDark}
										loading="lazy"
										alt={feature.title}
										className="h-48 mb-6 hidden dark:block rounded-md"
									/>
									<h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-black dark:text-white mb-2">
										{feature.title}
									</h3>
									<p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xs">
										{feature.description}
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</section>
				<section className="py-16 md:py-20 relative bg-gray-50 dark:bg-gray-900">
					<div className="relative z-10 min-h-[50vh] md:min-h-[60vh] flex flex-col justify-center items-center px-4 md:px-6 pt-20 md:pt-32 pb-16 md:pb-20 text-center">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6 }}
							className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent max-w-3xl mx-auto"
						>
							Ready to get started?
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-gray-600 dark:text-gray-300 px-4"
						>
							Join us and explore how your DNA can power breakthroughs.
						</motion.p>
						<motion.button
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-base md:text-lg font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
						>
							Create an account
						</motion.button>
					</div>
				</section>

				{/* Contact Section */}
				<section className="py-16 md:py-20 px-4 md:px-8 lg:px-16 xl:px-20 bg-white dark:bg-gray-950 -mt-10 md:-mt-20 relative z-20">
					<motion.div
						variants={sectionVariants}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true }}
						className="max-w-4xl mx-auto"
					>
						<div className="text-center mb-12">
							<h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-gray-700 to-gray-500 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent max-w-3xl mx-auto">
								Get in Touch
							</h2>
							<p className="text-gray-600 dark:text-gray-300 text-lg">
								Have questions? We'd love to hear from you.
							</p>
						</div>

						<motion.div
							variants={contactVariants}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true }}
							className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-[0_0_30px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_-2px_rgba(0,0,0,0.2)] dark:hover:shadow-[0_0_30px_-2px_rgba(0,0,0,0.4)] transition-shadow duration-300"
						>
							<form className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label
											htmlFor="name"
											className="text-sm font-medium text-gray-700 dark:text-gray-200"
										>
											Name
										</Label>
										<Input
											id="name"
											placeholder="John Doe"
											className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
										/>
									</div>
									<div className="space-y-2">
										<Label
											htmlFor="email"
											className="text-sm font-medium text-gray-700 dark:text-gray-200"
										>
											Email
										</Label>
										<Input
											id="email"
											type="email"
											placeholder="john@example.com"
											className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
										/>
									</div>
								</div>
								<div className="space-y-2">
									<Label
										htmlFor="message"
										className="text-sm font-medium text-gray-700 dark:text-gray-200"
									>
										Message
									</Label>
									<textarea
										id="message"
										rows={4}
										placeholder="How can we help you?"
										className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700"
									/>
								</div>
								<div className="flex justify-end">
									<Button
										type="submit"
										className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 hover:from-blue-700 hover:to-blue-600"
									>
										Send Message
									</Button>
								</div>
							</form>
						</motion.div>
					</motion.div>
				</section>

				<Footer />
			</main>
		</div>
	);
}
