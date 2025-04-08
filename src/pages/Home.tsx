import { Header } from "../components/layout/main/Header/Header";
import { Footer } from "../components/layout/main/Footer/Footer";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />

			<main className="flex-grow">
				{/* Your landing page sections */}
				<section className="py-16 px-4 text-center">
					<h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
					<p className="text-lg text-gray-600">
						This is your landing page intro text.
					</p>
				</section>

				{/* Add more sections below as needed */}
			</main>

			<Footer />
		</div>
	);
}
