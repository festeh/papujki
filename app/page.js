import Gif from "../components/gif"
import DaysCounter from "../components/counter"
import HeartSvg from "../components/heart_svg"
import Dates from "../components/dates"

const page = () => {
	return (
		<div className="min-h-screen">
			{/* Header Section with Counter and Gifs */}
			<header className="header-section">
				<div className="flex items-center justify-center text-center">
					<DaysCounter />
					<Gif type="parrot" />
					<Gif type="reverse" />
				</div>
			</header>

			{/* Main Content Section with Dates */}
			<main className="content-section">
				<Dates />
			</main>

			{/* Footer Section with Hearts */}
			<footer className="footer-section">
				<div className='heart-container flex items-center justify-center w-full'>
					<HeartSvg className="heart" />
					<HeartSvg className="heart" />
					<HeartSvg className="heart" />
				</div>
			</footer>
		</div>
	)
}

export default page
