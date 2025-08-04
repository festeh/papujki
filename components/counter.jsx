'use client'

import dayjs from 'dayjs';

const DaysCounter = () => {
	const date = "2019-09-04";
	const parsedDate = dayjs(date);
	const currentDate = dayjs();
	const dateDelta = currentDate.diff(parsedDate, 'day');
	return (
		<div className="flex-1 pr-2 sm:pr-4">
			<h1 className="text-2xl sm:text-3xl text-white break-words" style={{fontFamily: 'Lobster, cursive'}}>
				Папужки вместе уже <span className="text-highlight text-3xl sm:text-4xl" style={{fontFamily: 'Lobster, cursive'}}>{dateDelta}</span> дней  
			</h1>
		</div>
	)
}

export default DaysCounter
