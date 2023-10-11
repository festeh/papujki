"use client"

import React from 'react'
import dayjs from 'dayjs';
import { greg, Sedra, HebrewCalendar, HDate, Location, HavdalahEvent } from '@hebcal/core';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';

let papujki_dates = [
	{ name: "Папужковчина", date: "09-04" },
	{ name: "ДР Котика", date: "09-03" },
	{ name: "ДР Зайки", date: "01-10" },
	{ name: "Годовщина свадьбы", date: "04-28" },
]

const Allowed = [
	"Purim",
	"Pesach I ",
	"Pesach II",
	"Pesach III (CH''M)",
	"Pesach IV (CH''M)",
	"Pesach V (CH''M)",
	"Pesach VI (CH''M)",
	"Pesach VII",
	"Pesach I",
	"Tish'a B'Av",
	"Sukkot I",
	"Sukkot II",
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
	console.log(this_year_cal.map(createEvent));
	const jewish_events = this_year_cal.map(createEvent)
		.concat(next_year_cal.map(createEvent))
		.filter((ev) => Allowed.some(prefix => ev.name === prefix) || ev.name.startsWith(
			"Rosh Hashana 5") || ev.name.startsWith("Chanukah"))
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

function MakeListElement(str, key) {
	const li_style = "font-bold";
	return <ListItem className={li_style} key={key}>
		<ListItemButton color="primary" variant="soft" className="text-lg">
			{str}
		</ListItemButton>
	</ListItem>
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
		<List className="" size="md" variant=""
			sx={{
				borderRadius: 'lg',
			}}
		>
			{lis}
		</List>
	)
}

export default JewishDatesList
