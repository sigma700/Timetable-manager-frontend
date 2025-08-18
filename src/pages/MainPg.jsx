import React, { useState } from 'react';
import { FullMenu } from './components/animatedHamb';
import { useAuthStore } from '../store/authStore';
import HoverDevCards from './components/gridOPtions';
import { Link } from 'react-router-dom';
import { FaTable } from 'react-icons/fa';
import { useGenStore } from '../store/generativeStore';

const MainPg = () => {
	const { checkAuth, user, genTable, relValue, isLoading } = useAuthStore();
	const { gottenTable } = useGenStore();
	const [selectedClass, setSelectedClass] = useState(null);

	// Set initial selected class if timetables exist
	React.useEffect(() => {
		if (gottenTable?.timetables?.length > 0 && !selectedClass) {
			setSelectedClass(gottenTable.timetables[0].name);
		}
	}, [gottenTable, selectedClass]);

	// Helper function to check if period is double
	const isDoublePeriod = (period) => {
		if (!period || !period.startTime || !period.endTime) return false;
		const start = new Date(`2000-01-01T${period.startTime}`);
		const end = new Date(`2000-01-01T${period.endTime}`);
		const duration = (end - start) / (1000 * 60);
		return duration > 40; // Assuming standard period duration is 40 minutes
	};

	// Format time helper
	const formatTime = (timeStr) => {
		if (!timeStr || typeof timeStr !== 'string') return '';
		try {
			const [hours, minutes] = timeStr.split(':');
			const hour = parseInt(hours, 10);
			if (isNaN(hour)) return timeStr;
			return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
		} catch {
			return timeStr;
		}
	};

	// Get the selected timetable
	const selectedTimetable =
		gottenTable?.timetables?.find((t) => t.name === selectedClass) || gottenTable?.timetables?.[0];

	return (
		<main className="text-white min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
			<FullMenu />
			{/* Main content area */}
			<div className="w-full flex flex-col items-center z-0 p-4 lg:p-8 pt-20">
				{' '}
				{/* Added pt-20 for menu spacing */}
				{/* Welcome section with improved styling */}
				<div className="w-full max-w-4xl text-center mb-8">
					<h1 className="font-bold text-3xl lg:text-5xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
						Welcome {user}!
					</h1>
					<p className="text-gray-400 text-sm lg:text-base">Manage your schedules efficiently</p>
				</div>
				{/* Action section with subtle glow effect */}
				<div className="w-full max-w-4xl mb-8">
					<div className="styled-container mb-6">
						<h2 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-2">Select Action</h2>
						<div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"></div>
					</div>
					<div className="w-full">
						<HoverDevCards />
					</div>
				</div>
				{/* View Timetables button with enhanced styling */}
				<div className="w-full max-w-md flex justify-center my-8">
					<Link
						to="/home/timetables"
						className="relative overflow-hidden group p-5 lg:p-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold flex items-center justify-center gap-4 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
					>
						<span className="relative z-10">View Timetables</span>
						<FaTable className="relative z-10" />
						<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</Link>
				</div>
				{/* Timetables section with improved empty state and preview */}
				<div className="w-full max-w-4xl mt-8">
					<h3 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-4 text-center">
						Your Timetables
					</h3>
					<div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-slate-700/50">
						{gottenTable?.timetables?.length > 0 ? (
							<div className="overflow-x-auto">
								{/* Class selector tabs */}
								<div className="mb-4 flex overflow-x-auto pb-2">
									{gottenTable.timetables.map((timetable) => (
										<button
											key={timetable.name}
											onClick={() => setSelectedClass(timetable.name)}
											className={`whitespace-nowrap px-4 py-2 mr-2 rounded-lg text-sm font-medium ${
												selectedClass === timetable.name
													? 'bg-indigo-600 text-white'
													: 'bg-slate-700 text-gray-300 hover:bg-slate-600'
											}`}
										>
											{timetable.name.replace('Timetable for ', '')}
										</button>
									))}
								</div>

								{/* Compact timetable preview */}
								<div className="min-w-max">
									{/* Days header */}
									<div className="grid grid-cols-8 gap-1 mb-2">
										<div className="w-16"></div> {/* Time column spacer */}
										{selectedTimetable?.schedule?.slice(0, 5).map((day) => (
											<div
												key={day.day}
												className="text-center text-sm font-medium text-gray-300 p-1 truncate"
											>
												{day.day.substring(0, 3)}
											</div>
										))}
									</div>

									{/* Period rows */}
									{selectedTimetable?.schedule?.[0]?.periods?.slice(0, 5).map((_, periodIdx) => (
										<div key={`preview-row-${periodIdx}`} className="grid grid-cols-8 gap-1 mb-1">
											{/* Time label */}
											<div className="w-16 text-xs text-gray-400 self-center">
												{formatTime(selectedTimetable.schedule[0].periods[periodIdx]?.startTime)}
											</div>

											{/* Day cells */}
											{selectedTimetable.schedule.slice(0, 5).map((day) => {
												const period = day.periods?.[periodIdx];
												if (!period) return <div key={`empty-${day.day}`} className="h-8"></div>;

												return (
													<div
														key={`${day.day}-${periodIdx}`}
														className={`h-8 rounded-sm p-1 text-xs flex items-center justify-center ${
															period.isBreak
																? 'bg-amber-900/30 text-amber-300'
																: period.subject
																? 'bg-blue-900/30 text-blue-300'
																: 'bg-gray-700/30'
														} ${isDoublePeriod(period) ? 'border-l-2 border-l-purple-400' : ''}`}
														title={
															period.subject?.name ||
															(period.isBreak ? 'Break' : 'Free') +
																(period.startTime
																	? `\n${formatTime(period.startTime)} - ${formatTime(
																			period.endTime
																	  )}`
																	: '')
														}
													>
														<span className="truncate">
															{period.subject?.name?.substring(0, 3) ||
																(period.isBreak ? 'Brk' : '')}
														</span>
													</div>
												);
											})}
										</div>
									))}

									<div className="mt-4 text-center text-sm text-gray-400">
										Showing first 5 periods of workweek -{' '}
										<Link to="/home/timetables" className="text-blue-400 hover:underline">
											View full timetable
										</Link>
									</div>
								</div>
							</div>
						) : (
							/* Empty state */
							<div className="text-gray-400 mb-6 text-center">
								<svg
									className="w-16 h-16 mx-auto opacity-70"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1.5}
										d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
									/>
								</svg>
								<p className="mt-4 text-lg">No timetables created yet</p>
								<Link
									to="/home/create-table"
									className="mt-4 inline-block px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
								>
									Create New Timetable
								</Link>
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

export default MainPg;
