
import { Footer } from "./Footer";

export default {
	title: "Layout/Footer",
	component: Footer,
};

export const Light = () => (
	<div className="bg-background text-foreground min-h-screen">
		<Footer />
	</div>
);

export const Dark = () => (
	<div className="dark bg-background text-foreground min-h-screen">
		<Footer />
	</div>
);
