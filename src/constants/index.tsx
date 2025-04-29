const features = [
	{
		srcLight: "/privacy-light.png",
		srcDark: "/privacy-dark2.png",
		title: "Privacy Focused",
		description:
			"Your data stays your data — always handled with utmost confidentiality and respect.",
	},
	{
		srcLight: "endtoendlight.png",
		srcDark: "endtoend.png",
		title: "End to End Encrypted",
		description:
			"Every interaction is encrypted from sender to receiver — no middleman ever sees it.",
	},
	{
		srcLight: "compliance2.png",
		srcDark: "compliance2.png",
		title: "Compliance Checks",
		description:
			"Fully aligned with industry standards and legal data regulations across the globe.",
	},
];

// Example structure in constants/features.ts
const services = [
	{
		title: "DNA Sequencing",
		description:
			"Unlock deep insights from genetic material to drive personalized analysis.",
		srcLight: "/service1.png", // Add the light image version in public folder
		srcDark: "/service1.png", // Add the dark image version in public folder
	},
	{
		title: "DNA to Face Analysis",
		description:
			"Predict facial features based on genomic data using advanced algorithms.",
		srcLight: "/service2.png",
		srcDark: "/service2.png",
	},
	{
		title: "Age, Height, Gender, Ancestry",
		description:
			"Analyze phenotypic traits and ancestral roots with unparalleled precision.",
		srcLight: "/service3.png",
		srcDark: "/service3.png",
	},
];

export { services, features };