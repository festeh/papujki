'use client'

import dayjs from 'dayjs';

const DaysCounter = () => {
	const date = "2019-09-04";
	const parsedDate = dayjs(date);
	const currentDate = dayjs();
	const dateDelta = currentDate.diff(parsedDate, 'day');
	return (
		<div>
			<h1 className="ml-2 text-3xl text-white" style={{fontFamily: 'Lobster, cursive'}}>
				Папужки вместе уже <span className="text-highlight text-4xl" style={{fontFamily: 'Lobster, cursive'}}>{dateDelta}</span> дней  
			</h1>
		</div>
	)
}

export default DaysCounter
