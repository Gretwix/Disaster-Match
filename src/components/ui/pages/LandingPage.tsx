// Importar imágenes como módulos para compatibilidad con Vite/React
import Icon from "/Icon.png";
import Carr from "/Carr.png";
import MainIm from "/MainIm.png";
import Crimes from "/Crimes.png";
import Emerg from "/Emerg.png";
import In from "/In.png";
import { useNavigate } from "@tanstack/react-router";

// Tipos
type CardImgType = { title: string; img: string };
type CardUseType = { title: string; content: string };
type PricingType = { title: string; benefits: string[]; price: number };

// NavBar
const NavBar = () => {
	const navigate = useNavigate();
	return (
		<div className="flex items-center justify-between">
			<div className="flex items-center gap-16">
				<img src={Icon} className="w-10 h-full cursor-pointer" alt="alt" />
				<p className="text-gray-400 text-2xl">911 incidents report</p>
			</div>
			<div className="flex items-center gap-12">
				<img src={Carr} className="mb-2" alt="" />
				<button onClick={() => navigate({ to: "/Login" })} className="mt-4 mb-4 px-4 py-1 bg-blue-700 text-white rounded-sm hover:bg-purple-700 transition">Sign In</button>
			</div>
		</div>
	);
};

// Banner
const Banner = () => (
	<div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-8">
		<div className="text-left py-8 pl-4">
			<h1 className="text-[36px] font-semibold mb-6 mt-4">Real-Time incident reporting</h1>
			<p className="text-gray-400 mb-6 text-2xl">Browse and get immediate access to verified reports of emergencies, crimes, and incidents in your area.</p>
			<button className="mt-3 mb-4 px-4 py-1 bg-blue-700 text-white rounded-sm hover:bg-purple-700 transition">See Services</button>
		</div>
		<img src={MainIm} className="w-70 justify-self-end" alt="alt" />
	</div>
);

// CardImg
const cardImgData: CardImgType[] = [
	{ title: "CRIMES", img: Crimes },
	{ title: "EMERGENCIES", img: Emerg },
	{ title: "INCIDENTS", img: In },
];
const CardImg = (props: CardImgType) => {
	const colors: Record<string, { text: string; bg: string }> = {
		CRIMES: { text: "text-blue-800", bg: "bg-blue-300" },
		EMERGENCIES: { text: "text-green-800", bg: "bg-green-300" },
		INCIDENTS: { text: "text-red-800", bg: "bg-red-300" },
		DEFAULT: { text: "text-gray-800", bg: "bg-gray-300" },
	};
	const { text, bg } = colors[props.title] || colors.DEFAULT;
	return (
		<div className="bg-white shadow-lg flex flex-col transition hover:scale-105 hover:shadow-2xl">
			<h3 className={`absolute ml-4 mt-4 px-3 py-1 w-fit rounded-2xl text-sm mb-6 ${text} ${bg}`}>{props.title}</h3>
			<img className="mb-4 mt-4" src={props.img} alt={props.title} />
		</div>
	);
};

// CardUse
const cardUseData: CardUseType[] = [
	{ title: "Search by location", content: "Enter your area and see available incident reports nearby" },
	{ title: "Select the incident", content: "Choose the type of emergency or event you want to review" },
	{ title: "Download the report instantly", content: "Access verified information in just one click" },
];
const CardUse = (props: CardUseType) => {
	const colors: Record<string, string> = {
		SEARCH: "bg-green-700",
		SELECT: "bg-yellow-600",
		DEFAULT: "bg-amber-800",
		DOWNLOAD: "bg-red-800",
	};
	const color = colors[props.title.toUpperCase().split(" ")[0]] || colors.DEFAULT;
	return (
		<div className="px-6 pt-6 rounded-1xl shadow-lg flex flex-col transition hover:scale-105 hover:shadow-2xl">
			<h3 className={`rounded-2xl px-6 py-2 text-sm mb-6 text-white ${color}`}>{props.title}</h3>
			<p className="text-sm bg- text-black mb-4">{props.content}</p>
		</div>
	);
};

// Pricing
const pricingData: PricingType[] = [
	{
		title: "BASIC",
		benefits: ["Limited access to reports", "Basic queries by location", "Up to 10 reports per month"],
		price: 4.99,
	},
	{
		title: "STANDARD",
		benefits: ["Access to all types of reports", "Unlimited queries per location", "Up to 50 reports per month", "Real-time email alerts"],
		price: 9.99,
	},
	{
		title: "PREMIUM",
		benefits: ["Unlimited access to reports", "Unlimited queries and downloads", "Real-time alerts via email and SMS", "Advanced statistics and dashboard", "24/7 priority support."],
		price: 14.99,
	},
];
const Pricing = (props: PricingType) => {
	const colors: Record<string, string> = {
		BASIC: "bg-blue-400",
		PREMIUM: "bg-purple-600",
		DEFAULT: "bg-purple-500",
	};
	const color = colors[props.title] || colors.DEFAULT;
	return (
		<div className="shadow-lg flex flex-col transition hover:scale-105 hover:shadow-2xl">
			<h3 className={`py-2 text-2xl text-white ${color}`}>{props.title}</h3>
			<ul className="px-2 py-2 flex-1 text-black mb-2">
				{props.benefits.map((value: string, index: number) => (
					<li key={index} className="border-b-black text-left py-1 mb-2 border-b-1">{value}</li>
				))}
			</ul>
			<span className="text-xl font-semibold text-black mb-4">${props.price}/Month</span>
			<button className="self-center mb-4 px-4 py-2 w-fit bg-blue-600 text-white rounded-lg hover:bg-purple-700 transition">Buy Now</button>
		</div>
	);
};

const LandingPage = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<nav className="px-8 py-4 shadow-md bg-white">
				<NavBar />
			</nav>
			<section className="px-8 py-8">
				<Banner />
			</section>
			<section className="px-8 py-8 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{cardImgData.map((card, idx) => (
					<CardImg key={idx} {...card} />
				))}
			</section>
			<section className="px-8 py-8 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{cardUseData.map((card, idx) => (
					<CardUse key={idx} {...card} />
				))}
			</section>
			<section className="px-8 py-8 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
				{pricingData.map((plan, idx) => (
					<Pricing key={idx} {...plan} />
				))}
			</section>
		</div>
	);
};

export default LandingPage;
