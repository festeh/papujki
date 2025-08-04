'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LashonHaraCounter = () => {
	const [days, setDays] = useState(0);
	const [showConfetti, setShowConfetti] = useState(false);
	const [longPressTimer, setLongPressTimer] = useState(null);
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
		
		// Trigger confetti animation
		setShowConfetti(true);
		setTimeout(() => setShowConfetti(false), 1000);
	};

	const handleLongPressStart = () => {
		const timer = setTimeout(() => {
			router.push('/lashon-hara-settings');
		}, 1500); // 1500ms long press
		setLongPressTimer(timer);
	};

	const handleLongPressEnd = () => {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			setLongPressTimer(null);
		}
	};

	return (
		<div 
			className="bg-blue-100 rounded-lg p-4 mb-4 cursor-pointer hover:bg-blue-200 transition-colors duration-200 shadow-sm relative overflow-hidden"
			onMouseDown={handleLongPressStart}
			onMouseUp={handleLongPressEnd}
			onMouseLeave={handleLongPressEnd}
			onTouchStart={handleLongPressStart}
			onTouchEnd={handleLongPressEnd}
		>
			{/* Confetti Animation */}
			{showConfetti && (
				<div className="absolute inset-0 pointer-events-none">
					{(() => {
						const allEmojis = ['✨', '⭐', '🌟', '💫', '🎊', '🎉', '😎', '🤩', '🥳', '🎈', '🏆', '👑', '🌈', '💖', '🎯', '🔥'];
						const shuffled = [...allEmojis].sort(() => 0.5 - Math.random());
						const selectedEmojis = shuffled.slice(0, 2);
						
						return [...Array(20)].map((_, i) => {
							const emoji = selectedEmojis[i % 2];
							return (
								<div
									key={i}
									className="absolute animate-bounce"
									style={{
										left: `${Math.random() * 100}%`,
										top: `${Math.random() * 100}%`,
										animationDelay: `${Math.random() * 0.5}s`,
										animationDuration: '1s'
									}}
								>
									<span className="text-lg">{emoji}</span>
								</div>
							);
						});
					})()}
				</div>
			)}
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
