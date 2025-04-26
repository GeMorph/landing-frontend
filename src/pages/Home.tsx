import { useEffect, useState } from "react";
import { Header } from "../components/layout/main/Header/Header";
import { Footer } from "../components/layout/main/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";
import features from "@/constants";

export default function Home() {
	const fullText = "Giving a Face to Every DNA";
	const [displayedText, setDisplayedText] = useState("");
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		let i = 0;
		const interval = setInterval(() => {
			setDisplayedText(fullText.slice(0, i + 1));
			i++;
			if (i === fullText.length) {
				clearInterval(interval);
				setTimeout(() => setShowButton(true), 500); // delay before button appears
			}
		}, 70); // typing speed

		return () => clearInterval(interval);
	}, []);

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
			<Header />
			<main className="flex-grow">
				<section className="py-0 md:px-0 lg:px-10 xl:px-12 sm:mx-0 md:mx-0 lg:mx-8 xl:mx-12 text-left md:py-0 lg:py-6 xl:py-6">
					<div className="relative rounded-2xl overflow-hidden shadow-sm h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[800px]">
						<img
							src="hero7.png"
							className="block dark:hidden w-full h-full object-cover"
							alt="Hero Light"
						/>
						<img
							src="hero6.png"
							className="hidden dark:block w-full h-full object-cover"
							alt="Hero Dark"
						/>

						{/* Overlay */}
						<div className="absolute inset-0 flex items-center justify-center">
							{/* Container to adjust text and button positioning */}
							<div className="text-foreground absolute bottom-8 sm:bottom-9 md:bottom-12 lg:bottom-15 xl:bottom-20 left-0 right-0 flex flex-col items-center px-5">
								<motion.h1
									className="text-md sm:text-md md:text-3xl lg:text-3xl xl:text-5xl font-bold mb-1 sm:mb-2 md:mb-3 lg:mb-4 xl:mb-5 whitespace-pre-wrap"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 1 }}
								>
									{displayedText}
								</motion.h1>

								<AnimatePresence>
									{showButton && (
										<motion.button
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0 }}
											transition={{ delay: 0.2, duration: 0.6 }}
											className="text-sm sm:text-sm xl:text-xl px-2 py-1.5 sm:px-3 sm:py-1.5 md:py-2 xl:py-3 bg-white text-black dark:bg-blue-900 dark:text-white font-normal rounded-md shadow hover:bg-gray-100 dark:hover:bg-blue-800 transition mt-2"
										>
											Get Started
										</motion.button>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12 px-4 md:px-8 lg:px-16 xl:px-20">
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
			</main>

			<Footer />
		</div>
	);
}
