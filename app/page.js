import Gif from "../components/gif"
import DaysCounter from "../components/counter"
import HeartSvg from "../components/heart_svg"
import Dates from "../components/dates"

const page = () => {
	return (
		<div>
			<div className="flex items-center justify-center heading text-center mt-5 text-4xl text-black font-lobster">
				<DaysCounter />
				<Gif type="parrot" />
				<Gif type="reverse" />
			</div>
			<div className='p-5 m-2 rounded-xl border-2 border-red-300 grid grid-cols-3'>
				<Dates />
			</div>
			<div className='heart-container flex items-center justify-center w-full'>
				<HeartSvg className="heart" />
				<HeartSvg className="heart" />
				<HeartSvg className="heart" />
			</div>
		</div>
	)
}

export default page
