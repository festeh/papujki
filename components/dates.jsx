"use client"

import React from 'react'
import dayjs from 'dayjs';
import { greg, Sedra, HebrewCalendar, HDate, Location, HavdalahEvent } from '@hebcal/core';

let papujki_dates = [
	{ name: "ДР Зайки", date: "01-10" },
	{ name: "Годовщина свадьбы", date: "04-28" },
	{ name: "ДР Дины", date: "09-02" },
	{ name: "ДР Котика", date: "09-03" },
	{ name: "Папужковчина", date: "09-04" },
]

const Allowed = [
	"Tu BiShvat",
	"Purim",
	"Pesach I",
	"Pesach VII",
	"Tish'a B'Av",
	"Sukkot I",
	"Shavuot I",
	"Yom HaShoah",
	"Yom Kippur",
	"Rosh Hashana 5",
	"Chanukah: 1 Candle",
	"Simchat Torah",
	"Shmini Atzeret",
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
		return ev.desc == "Havdalah" && ev.getDate().abs() >= hebDate.abs();
	});
	if (!firstHavdalah) {
		return "";
	}
	return "✨" + firstHavdalah.eventTimeStr;
}

function getCandleLightTime(allEvents, hebDate) {
	const candleLight = allEvents.find((ev) => {
		return ev.desc == "Candle lighting" && ev.getDate().abs() >= hebDate.abs();
	});
	if (!candleLight) {
		return "";
	}
	return "🕯️" + candleLight.eventTimeStr;
}

function createEvent(ev) {
	return (
		{ "name": ev.render('en'), "date": ev.getDate().greg().toISOString().split('T')[0] }
	)
}

function removeDuplicates(arr) {
	const uniqueSet = new Set();
	const result = [];

	for (const obj of arr) {
		if (!uniqueSet.has(obj.name)) {
			uniqueSet.add(obj.name);
			result.push(obj);
		}
	}

	return result;
}

function CollectEvents(currentDate, this_year_cal, next_year_cal) {
	let papujki_events = papujki_dates.map((info) => {
		return { "name": info.name, "date": getEventDateStr(info.date, currentDate) }
	});
	console.log(this_year_cal.map(createEvent).filter((ev) => !ev.name.startsWith("Candle") && !ev.name.startsWith("Havdal") && !ev.name.startsWith("Fast beg")))
	const jewish_events = this_year_cal.map(createEvent)
		.concat(next_year_cal.map(createEvent))
		.filter((ev) => Allowed.some(prefix => ev.name === prefix) || ev.name.startsWith(
			"Rosh Hashana 5"))
	papujki_events = papujki_events.concat(jewish_events);
	papujki_events = papujki_events.sort((a, b) => {
		return a.date.localeCompare(b.date);
	})
		.filter((ev) => {
			return ev.date.localeCompare(currentDate.toISOString().split('T')[0]) >= 1
		})
	console.log(papujki_events);
	papujki_events = removeDuplicates(papujki_events);
	return papujki_events;
}

// Custom List Components
const CustomList = ({ children, className = "" }) => {
	return (
		<div className={`bg-blue-50 rounded-lg overflow-hidden shadow-sm ${className}`}>
			{children}
		</div>
	);
};

const CustomListItem = ({ children, className = "" }) => {
	return (
		<div className={`border-b border-blue-100 last:border-b-0 ${className}`}>
			{children}
		</div>
	);
};

const CustomListItemButton = ({ children, className = "" }) => {
	return (
		<button className={`w-full p-4 text-left bg-blue-100 hover:bg-blue-200 transition-colors duration-200 focus:outline-none focus:bg-blue-200 ${className}`}>
			{children}
		</button>
	);
};

function MakeListElement(str, key) {
	return (
		<CustomListItem key={key}>
			<CustomListItemButton className="font-bold text-lg text-blue-900">
				{str}
			</CustomListItemButton>
		</CustomListItem>
	);
}

function getCalendar(year) {
	let options = {
		year: year,
		isHebrewYear: false,
		candlelighting: true,
		location: Location.lookup('Berlin'),
		sedrot: false,
		omer: false,
	};
	return HebrewCalendar.calendar(options);
}

function getEventDateStr(name, currentDate) {
	let thisYearDateStr = currentDate.getFullYear() + "-" + name
	let thisYearDate = new Date(thisYearDateStr);
	if (thisYearDate >= currentDate) {
		return thisYearDateStr
	}
	return (currentDate.getFullYear() + 1) + "-" + name
}


const JewishDatesList = () => {
	const currentDate = new Date();
	const rd = greg.greg2abs(currentDate);
	const hebDate = new HDate(rd);
	const thisYearCalendar = getCalendar(currentDate.getFullYear());
	const nextYearCalendar = getCalendar(currentDate.getFullYear() + 1);
	const papujki_events = CollectEvents(currentDate, thisYearCalendar, nextYearCalendar);
	const parsha = getParsha(hebDate);
	const havdalahTime = getHavdalahTime(thisYearCalendar, hebDate);
	const candleLightTime = getCandleLightTime(thisYearCalendar, hebDate);
	const lis = [MakeListElement(`${parsha} ${candleLightTime}  ${havdalahTime}`, "parsha")];
	lis.push(...papujki_events.map((info) => {
		const evDesc = <p>
			{info.name + " "}
			<span className='font-normal'>
				(Через {days_format(dayjs(info.date).diff(currentDate, 'day'))}) </span>
		</p>
		return MakeListElement(evDesc, info.name);
	}))
	return (
		<div className="w-full">
			<CustomList className="w-full">
				{lis}
			</CustomList>
		</div>
	)
}

export default JewishDatesList
