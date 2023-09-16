'use client'

import dayjs from 'dayjs';

const DaysCounter = () => {
	const date = "2019-09-04";
	const parsedDate = dayjs(date);
	const currentDate = dayjs();
	const dateDelta = currentDate.diff(parsedDate, 'day');
	const heading = `Папужки вместе уже ${dateDelta} дней  `;
	return (
		<div>
			<h1 className="ml-2">{heading}</h1>
		</div>
	)
}

export default DaysCounter
