import { useEffect, useState } from "react";
import { Header } from "../components/layout/main/Header/Header";
import { Footer } from "../components/layout/main/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { features, services } from "@/constants";

export default function Home() {
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

	const featureVariants = {
		hidden: { opacity: 0, y: 50 },
		show: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.3,
				duration: 0.6,
				type: "spring",
				stiffness: 50,
			},
		}),
	};

	return (
		<div className="flex flex-col min-h-screen transition-all duration-300">
			<motion.div
				initial={{ y: 0 }}
				animate={{ y: showHeader ? 0 : -100 }}
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
						className="absolute inset-0 w-full h-full object-cover dark:hidden"
						alt="Hero Light"
					/>
					{/* Dark Mode Image */}
					<img
						src="hero6.png"
						className="absolute inset-0 w-full h-full object-cover hidden dark:block"
						alt="Hero Dark"
					/>

					{/* Overlay */}
					<div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
						{/* Heading Animation */}
						<motion.h1
							className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight"
							initial={{ opacity: 0, y: -50 }}
							animate={{ opacity: 1, y: 0 }}
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
				<section className="w-full bg-background text-foreground font-inter px-3 py-10">
					<div className="flex flex-center items-center justify-center">
						<h2 className="text-4xl font-extrabold mb-6">
							What makes Gemorph Unique
						</h2>
					</div>
					<div className="max-w-[80%] mx-auto grid md:grid-cols-2 gap-6 md:gap-10 items-center">
						{/* Left Side - Text Content */}
						<motion.div
							initial={{ opacity: 0, x: -50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							viewport={{ once: true }}
						>
							<p className=" text-gray-600 dark:text-gray-300 mb-4">
								Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
								commodo ligula eget dolor. Aenean massa. Cum sociis natoque
								penatibus et magnis dis parturient montes, nascetur ridiculus
								mus.
							</p>
							<p className=" text-gray-600 dark:text-gray-300">
								Donec quam felis, ultricies nec, pellentesque eu, pretium quis,
								sem. Nulla consequat massa quis enim.
							</p>
						</motion.div>

						{/* Right Side - Image */}
						<motion.div
							initial={{ opacity: 0, x: 50 }}
							whileInView={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
							viewport={{ once: true }}
							className="relative flex justify-center"
						>
							<img
								src="/dnatoface.png"
								alt="Illustration"
								className="w-[400px] h-auto dark:hidden"
							/>
							<img
								src="/whygemorph2.png"
								alt="Illustration"
								className="w-[500px] h-auto hidden dark:block"
							/>
						</motion.div>
					</div>
				</section>

				<section className="py-12 px-4 md:px-8 lg:px-16 xl:px-20">
					<div className="flex flex-center items-center justify-center">
						<h2 className="text-4xl font-extrabold mb-6">
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
									alt={feature.title}
									className="h-48 mb-6 block dark:hidden"
								/>
								<img
									src={feature.srcDark}
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
				</section>
				<section className="py-12 px-4 md:px-8 lg:px-16 xl:px-20">
					<div className="flex flex-center items-center justify-center">
						<h2 className="text-4xl font-extrabold mb-6">
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
									alt={feature.title}
									className="h-48 w-80 mb-6 block dark:hidden rounded-md"
								/>
								<img
									src={feature.srcDark}
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
				</section>
				<section className="relative bg-gray-100 dark:bg-gray-900 text-center text-gray-800 dark:text-white overflow-hidden">
					{/* Top Curved Wave */}
					<div className="absolute top-0 left-0 w-full">
						<svg
							className="w-full h-[100px]"
							viewBox="0 0 1440 320"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="currentColor"
								d="M0,64L48,85.3C96,107,192,149,288,154.7C384,160,480,128,576,112C672,96,768,96,864,122.7C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0Z"
							/>
						</svg>
					</div>

					{/* Main content */}
					<div className="relative z-10 min-h-[80vh] flex flex-col justify-center items-center px-6 pt-32">
						<h2 className="text-4xl md:text-5xl font-bold mb-4">
							Ready to get started?
						</h2>
						<p className="text-lg md:text-xl mb-8 max-w-xl">
							Join us and explore how your DNA can power breakthroughs.
						</p>
						<button className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition">
							Create an account
						</button>
					</div>

					{/* Bottom Curved Wave */}
					<div className="absolute bottom-0 left-0 w-full rotate-180">
						<svg
							className="w-full h-[100px]"
							viewBox="0 0 1440 320"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill="currentColor"
								d="M0,64L48,85.3C96,107,192,149,288,154.7C384,160,480,128,576,112C672,96,768,96,864,122.7C960,149,1056,203,1152,218.7C1248,235,1344,213,1392,202.7L1440,192V320H1392C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320H0Z"
							/>
						</svg>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
