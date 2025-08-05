'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LashonHaraSettingsPage = () => {
	const [days, setDays] = useState('');
	const [currentDays, setCurrentDays] = useState(0);
	const [maxStreak, setMaxStreak] = useState(0);
	const router = useRouter();

	useEffect(() => {
		fetchCounter();
	}, []);

	const fetchCounter = async () => {
		try {
			const response = await fetch('/api/lashon-hara');
			if (response.ok) {
				const data = await response.json();
				setCurrentDays(data.days);
				setMaxStreak(data.maxStreak || 0);
				setDays(data.days.toString());
			}
		} catch (error) {
			console.error('Error fetching counter:', error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newDays = parseInt(days, 10);
		if (!isNaN(newDays) && newDays >= 0) {
			try {
				const response = await fetch('/api/lashon-hara', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ days: newDays }),
				});
				
				if (response.ok) {
					router.push('/');
				}
			} catch (error) {
				console.error('Error updating counter:', error);
			}
		}
	};

	const handleBack = () => {
		router.push('/');
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
			<div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-20">
				<h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
					Set Days without Lashon Hara
				</h1>
				
				<div className="mb-6 text-center space-y-4">
					<div>
						<p className="text-gray-600 mb-2">Current count:</p>
						<p className="text-3xl font-bold text-blue-600">{currentDays}</p>
					</div>
					<div>
						<p className="text-gray-600 mb-2">Maximum streak:</p>
						<p className="text-2xl font-bold text-purple-600">{maxStreak}</p>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
							New value:
						</label>
						<input
							type="number"
							id="days"
							min="0"
							value={days}
							onChange={(e) => setDays(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-emerald-700"
							placeholder="Enter number of days"
							required
						/>
					</div>

					<div className="flex space-x-3">
						<button
							type="submit"
							className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
						>
							Save
						</button>
						<button
							type="button"
							onClick={handleBack}
							className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
						>
							Cancel
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LashonHaraSettingsPage;
