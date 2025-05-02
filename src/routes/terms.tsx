import { createFileRoute } from "@tanstack/react-router";
import { Terms } from "@/pages/Terms";
import { Header } from "@/components/layout/main/Header/Header";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<Header />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="container mx-auto px-4 py-8 max-w-4xl"
			>
				<Terms />
			</motion.div>
		</>
	);
}
