"use client"

import React from 'react'
import dayjs from 'dayjs';
import { greg, Sedra, HebrewCalendar, HDate, Location, HavdalahEvent } from '@hebcal/core';

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

function getParsha(hebDate) {
	const sed = new Sedra(hebDate.getFullYear(), false);
	return sed.getString(hebDate);
}

function getHavdalahTime(allEvents, hebDate) {
	const firstHavdalah = allEvents.find((ev) => {
		return ev.desc == "Havdalah" && ev.date.abs0 >= hebDate.abs0;
	});
	if (!firstHavdalah) {
		return "";
	}
	return "✨" + firstHavdalah.eventTimeStr;
}

function getCandleLightTime(allEvents, hebDate) {
	const candleLight = allEvents.find((ev) => {
		return ev.desc == "Candle lighting" && ev.date.abs0 >= hebDate.abs0;
	});
	if (!candleLight) {
		return "";
	}
	return "🕯️" + candleLight.eventTimeStr;
}


function CollectEvents(currentDate, allEvents) {
	let papujki_events = papujki_dates.map((info) => {
		return { "name": info.name, "date": currentDate.getFullYear() + "-" + info.date }
	});
	const jewish_events = allEvents.map(
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
	return papujki_events;
}

function MakeListElement(str, key) {
	const li_style = "bg-slate-200 p-2 mt-1 border-b";
	return <li className={li_style} key={key}>{str}</li>
}

const JewishDatesList = () => {
	const currentDate = new Date();
	const rd = greg.greg2abs(currentDate);
	const hebDate = new HDate(rd);
	const options = {
		year: currentDate.getFullYear(),
		isHebrewYear: false,
		candlelighting: true,
		location: Location.lookup('Berlin'),
		sedrot: false,
		omer: false,
	};
	const allEvents = HebrewCalendar.calendar(options);
	const papujki_events = CollectEvents(currentDate, allEvents);
	const parsha = getParsha(hebDate);
	const havdalahTime = getHavdalahTime(allEvents, hebDate);
	const candleLightTime = getCandleLightTime(allEvents, hebDate);
	const lis = [MakeListElement(`${parsha} ${candleLightTime}  ${havdalahTime}`, "parsha")];
	lis.push(...papujki_events.map((info) => {
		const evDesc = <p>
			{info.name + " "}
			<span className='text-lg'>
				(Через {days_format(dayjs(info.date).diff(currentDate, 'day'))}) </span>
		</p>
		return MakeListElement(evDesc, info.name);
	}))
	return (
		<ul className="flex flex-col text-black text-2xl font-bold font-roboto shadow-xl">
			{lis}
		</ul>
	)
}

export default JewishDatesList
