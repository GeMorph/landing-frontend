import { useEffect, useState } from "react";
import { Header } from "../components/layout/main/Header/Header";
import { Footer } from "../components/layout/main/Footer/Footer";
import { motion, AnimatePresence } from "framer-motion";

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

	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow">
				<section className="py-5 px-7 md:px-8 lg:px-10 xl:px-12	 sm:mx-0 md:mx-5 lg:mx-8 xl:mx-12 text-left">
					<div className="relative rounded-2xl overflow-hidden shadow-sm max-h-[800px]">
						{/* Light mode image */}
						<img
							src="hero5.png"
							className="block dark:hidden w-full h-auto max-h-[800px] object-cover rounded-2xl"
							alt="Hero Light"
						/>

						{/* Dark mode image */}
						<img
							src="hero6.png"
							className="hidden dark:block w-full h-auto max-h-[800px] object-cover rounded-2xl"
							alt="Hero Dark"
						/>

						{/* Overlay */}
						<div className="absolute inset-0 flex items-center justify-center">
							{/* Container to adjust text and button positioning */}
							<div className="text-foreground absolute bottom-5 sm:bottom-6 md:bottom-8 lg:bottom-15 xl:bottom-20 left-0 right-0 flex flex-col items-center px-5">
								<motion.h1
									className="text-sm sm:text-md md:text-2xl lg:text-3xl xl:text-5xl font-bold mb-0 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 whitespace-pre-wrap"
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
											className="text-[8px] sm:text-xs xl:text-lg px-2 py-0.5 sm:px-3 sm:py-1 bg-white text-black dark:bg-blue-900 dark:text-white font-normal rounded-md shadow hover:bg-gray-100 dark:hover:bg-blue-800 transition mt-0mt-2"
										>
											Get Started
										</motion.button>
									)}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
