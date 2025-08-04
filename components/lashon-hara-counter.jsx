'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LashonHaraCounter = () => {
	const [days, setDays] = useState(0);
	const router = useRouter();

	useEffect(() => {
		const savedDays = localStorage.getItem('lashonHaraDays');
		if (savedDays) {
			setDays(parseInt(savedDays, 10));
		}
	}, []);

	const incrementDays = (e) => {
		e.stopPropagation();
		const newDays = days + 1;
		setDays(newDays);
		localStorage.setItem('lashonHaraDays', newDays.toString());
	};

	const handleWidgetClick = () => {
		router.push('/lashon-hara-settings');
	};

	return (
		<div 
			className="bg-blue-100 rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-200 transition-colors duration-200 shadow-sm"
			onClick={handleWidgetClick}
		>
			<div className="text-center mb-3">
				<h2 className="text-lg font-bold text-blue-900">
					Days without Lashon Hara
				</h2>
			</div>
			<div className="flex items-center justify-center gap-4">
				<p className="text-2xl font-bold text-blue-800">
					{days}
				</p>
				<button
					onClick={incrementDays}
					className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
				>
					+1
				</button>
			</div>
		</div>
	);
};

export default LashonHaraCounter;