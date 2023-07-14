"use client"

import React from 'react'
import dayjs from 'dayjs';
import { HebrewCalendar, HDate, Location, Event } from '@hebcal/core';

let papujki_dates = [
	{ name: "Папужковчина", date: "09-04" },
	{ name: "ДР Котика", date: "09-03" },
	{ name: "ДР Зайки", date: "01-10" },
]

const Allowed = [
	"Purim",
	"Pesach I",
	// "Sukkot I", 
	"Shavuot I", "Yom Kippur",
	"Rosh Hashana 5",
	"Chanukah: 1",
]

function days_format(num) {
	if (num === 0) {
		return "Сегодня"
	}
	if (num === 11 || num === 12) {
		return `${num} дней`
	}
	if (num % 10 === 1) {
		return `${num} день`
	}
	if (num % 10 === 2 || num % 10 === 3 || num % 10 === 4) {
		return `${num} дня`
	}
	return `${num} дней`
}

const dates = () => {
	const currentDate = dayjs();
	let papujki_events = papujki_dates.map((info) => {
		return { "name": info.name, "date": currentDate.year() + "-" + info.date }
	});
	const options = {
		year: currentDate.year(),
		isHebrewYear: false,
		candlelighting: false,
		location: Location.lookup('Berlin'),
		sedrot: false,
		omer: false,
	};
	const jewish_events = HebrewCalendar.calendar(options).map(
		(ev) => {
			return { "name": ev.render('en'), "date": ev.getDate().greg().toISOString().split('T')[0] }
		}
	)
		.filter((ev) => Allowed.some(prefix => ev.name.startsWith(prefix) || ev.name == "Sukkot I"));
	papujki_events = papujki_events.concat(jewish_events);
	papujki_events = papujki_events.sort((a, b) => {
		return a.date.localeCompare(b.date);
	})
		.filter((ev) => {
			return ev.date.localeCompare(currentDate.toISOString().split('T')[0]) >= 1
		})

	return (
		<ul className="flex flex-col text-black text-2xl font-bold font-roboto shadow-xl">
			{papujki_events.map((info) => {
				return <li className="bg-slate-200 p-2 mt-1 border-b" key={info.name}>{info.name} <span className='text-lg'>(Через {days_format(dayjs(info.date).diff(currentDate, 'day'))}) </span></li>
			})}
		</ul>
	)
}

export default dates
