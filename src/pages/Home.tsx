import { Button } from "@/components/ui/button";
import type { FunctionComponent } from "../common/types";

export const Home = (): FunctionComponent => {

	return (
		<div className="w-screen h-screen flex flex-col gap-2 justify-center items-center">
			<h1>React vite boilerplate</h1>
			<p>Stack: Typescript, TailwindCSS, Shadcn-UI, Tanstack router, Tanstack query, Zustand, React hook form, Zod, Faker </p>
			<Button>Click me</Button>
		</div>
	);
};
