import { Header } from "./Header";

export default {
	title: "Layout/Header",
	component: Header,
};

export const Light = () => (
	<div className="bg-background text-foreground min-h-screen">
		<Header />
	</div>
);

export const Dark = () => (
	<div className="dark bg-background text-foreground min-h-screen">
		<Header />
	</div>
);
