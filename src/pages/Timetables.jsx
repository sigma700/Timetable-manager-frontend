import React, { useState, useEffect } from 'react';
import { useGenStore } from '../store/generativeStore';
import { useAuthStore } from '../store/authStore';
import { FullMenu } from './components/animatedHamb';

const Timetables = () => {
	const { gottenTable, isLoading, error, getTable } = useGenStore();
	const [selectedClass, setSelectedClass] = useState(null);
	const { checkAuth, requiredData, user } = useAuthStore();

	useEffect(() => {
		const fetchData = async () => {
			try {
				await getTable(requiredData);
			} catch (err) {
				console.error('Failed to fetch timetable:', err);
			}
		};

		if (!gottenTable && !isLoading) {
			fetchData();
		}
	}, [gottenTable, isLoading, getTable]);

	useEffect(() => {
		if (gottenTable?.timetables?.length > 0 && !selectedClass) {
			setSelectedClass(gottenTable.timetables[0].name);
		}
	}, [gottenTable, selectedClass]);

	if (isLoading) {
		return (
			<div className="p-8 max-w-md mx-auto space-y-6 animate-pulse">
				{/* Animated header with typing indicator */}
				<div className="text-center space-y-2">
					<h3 className="text-xl font-medium text-gray-700 flex justify-center items-center">
						Getting your timetable
						<span className="ml-2 flex space-x-1">
							{[...Array(3)].map((_, i) => (
								<span
									key={i}
									className="h-1.5 w-1.5 bg-blue-500 rounded-full inline-block animate-bounce"
									style={{ animationDelay: `${i * 0.1}s` }}
								/>
							))}
						</span>
					</h3>
					<p className="text-sm text-gray-500">Gathering all your sessions...</p>
				</div>

				{/* Animated book opening effect */}
				<div className="flex justify-center">
					<div className="relative w-24 h-32">
						<div className="absolute inset-0 bg-blue-100 rounded-lg shadow-md transform origin-left animate-[flip_1.5s_ease-in-out_infinite]"></div>
						<div className="absolute inset-0 bg-blue-50 rounded-lg shadow-md transform origin-right animate-[flip_1.5s_ease-in-out_infinite_reverse]"></div>
						<div className="absolute inset-0 flex items-center justify-center">
							<svg
								className="w-10 h-10 text-blue-400 animate-pulse"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
								></path>
							</svg>
						</div>
					</div>
				</div>

				{/* Progress indicator with steps */}
				<div className="space-y-3">
					<div className="flex justify-between text-xs text-gray-500">
						<span>Collecting data</span>
						<span>Almost there</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className="bg-gradient-to-r from-blue-400 to-purple-500 h-2.5 rounded-full animate-[progress_2s_ease-in-out_infinite]"
							style={{ width: '75%' }}
						></div>
					</div>
				</div>

				{/* Mini calendar preview animation */}
				<div className="grid grid-cols-7 gap-1 text-center">
					{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
						<div key={i} className="text-xs font-medium text-gray-400">
							{day}
						</div>
					))}
					{[...Array(35)].map((_, i) => (
						<div
							key={i}
							className={`h-6 rounded-sm ${
								i % 8 === 0 ? 'bg-blue-200' : 'bg-gray-100'
							} animate-pulse`}
							style={{ animationDelay: `${(i % 7) * 0.05}s` }}
						/>
					))}
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="p-4 text-center text-red-500">
				Error: {error}
				<button
					onClick={() => window.location.reload()}
					className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
				>
					Retry
				</button>
			</div>
		);
	}

	// Data availability checks
	if (!gottenTable) {
		return <div className="p-4 text-center text-gray-500">No timetable data available</div>;
	}

	if (!gottenTable.timetables || !Array.isArray(gottenTable.timetables)) {
		return <div className="p-4 text-center text-red-500">Invalid timetable structure</div>;
	}

	if (gottenTable.timetables.length === 0) {
		return <div className="p-4 text-center text-gray-500">No timetables available</div>;
	}

	if (!selectedClass) {
		return <div className="p-4 text-center text-gray-500">Initializing timetable...</div>;
	}

	const { timetables } = gottenTable;
	const selectedTimetable = timetables.find((t) => t.name === selectedClass) || timetables[0];

	// Helper functions
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

	const isDoublePeriod = (period) => {
		if (!period || !period.startTime || !period.endTime) return false;
		const start = new Date(`2000-01-01T${period.startTime}`);
		const end = new Date(`2000-01-01T${period.endTime}`);
		const duration = (end - start) / (1000 * 60);
		return duration > (selectedTimetable.config?.periodDuration || 40);
	};

	const renderClassTabs = () => (
		<div className="mb-6 border-b border-gray-200">
			<nav className="-mb-px flex space-x-8 overflow-x-auto">
				{timetables.map((timetable) => (
					<button
						key={timetable.name}
						onClick={() => setSelectedClass(timetable.name)}
						className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
							selectedClass === timetable.name
								? 'border-blue-500 text-blue-600'
								: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
						}`}
					>
						{timetable.name.replace('Timetable for ', '')}
					</button>
				))}
			</nav>
		</div>
	);

	const renderDesktopView = () => (
		<div className="hidden md:block overflow-x-auto">
			<table className="w-full border-collapse">
				<thead>
					<tr>
						<th className="border p-2 bg-gray-100 min-w-[120px]">Time</th>
						{selectedTimetable.schedule?.map((day) => (
							<th key={day.day} className="border p-2 bg-gray-100 min-w-[150px]">
								{day.day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{selectedTimetable.schedule?.[0]?.periods?.map((_, periodIdx) => {
						const period = selectedTimetable.schedule[0].periods[periodIdx];
						const periodTime = period
							? `${formatTime(period.startTime)} - ${formatTime(period.endTime)}`
							: `Period ${periodIdx + 1}`;

						return (
							<tr key={`period-${periodIdx}`}>
								<td className="border p-2 bg-gray-50 text-center">{periodTime}</td>
								{selectedTimetable.schedule.map((day) => {
									const currentPeriod = day.periods?.[periodIdx];
									if (!currentPeriod)
										return <td key={`${day.day}-empty`} className="border p-2"></td>;

									if (currentPeriod.isBreak) {
										return (
											<td
												key={`${day.day}-break-${periodIdx}`}
												className="border p-2 bg-amber-50 text-center"
											>
												<div className="font-medium text-amber-800">
													{currentPeriod.name || 'Break'}
												</div>
											</td>
										);
									}

									const doublePeriod = isDoublePeriod(currentPeriod);
									return (
										<td
											key={`${day.day}-${periodIdx}`}
											className={`border p-2 ${
												currentPeriod.warning
													? 'bg-red-50'
													: doublePeriod
													? 'bg-purple-50 border-l-4 border-l-purple-400'
													: 'bg-white'
											}`}
										>
											<div className="flex items-start gap-2">
												{doublePeriod && (
													<span className="bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded whitespace-nowrap">
														Double
													</span>
												)}
												<div>
													{currentPeriod.subject && (
														<>
															<div className="font-medium">{currentPeriod.subject.name}</div>
															<div className="text-sm text-gray-600">
																{currentPeriod.teacher?.name || 'No teacher'}
															</div>
															{currentPeriod.warning && (
																<div className="text-xs text-red-500 mt-1">
																	{currentPeriod.warning}
																</div>
															)}
														</>
													)}
												</div>
											</div>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);

	const renderMobileView = () => (
		<div className="md:hidden space-y-4">
			{selectedTimetable.schedule?.map((day) => (
				<div key={day.day} className="border rounded-lg overflow-hidden">
					<h3 className="bg-gray-100 p-3 font-bold text-lg">{day.day}</h3>
					<div className="divide-y">
						{day.periods?.map((period, idx) => {
							const doublePeriod = isDoublePeriod(period);
							return (
								<div
									key={`${day.day}-period-${idx}`}
									className={`p-3 ${
										period.isBreak
											? 'bg-amber-50'
											: period.warning
											? 'bg-red-50'
											: doublePeriod
											? 'bg-purple-50 border-l-4 border-l-purple-400'
											: 'bg-white'
									}`}
								>
									<div className="flex justify-between items-start">
										<div>
											<span className="font-medium">
												{period.isBreak ? (
													<span className="text-amber-800">Break</span>
												) : (
													`Period ${period.periodNumber || idx + 1}`
												)}
												{doublePeriod && (
													<span className="ml-2 bg-purple-100 text-purple-800 text-xs px-1.5 py-0.5 rounded">
														Double
													</span>
												)}
												:{' '}
											</span>
											<span>
												{formatTime(period.startTime)} - {formatTime(period.endTime)}
											</span>
										</div>
										{period.subject && (
											<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
												{period.subject.name}
											</span>
										)}
										{period.isBreak && (
											<span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">
												{period.name || 'Break'}
											</span>
										)}
									</div>

									{period.isBreak ? (
										<div className="mt-2 text-sm text-amber-700">
											Duration: {period.duration} minutes
										</div>
									) : period.subject ? (
										<div className="mt-2">
											<div className="text-sm">
												<span className="text-gray-600">Teacher: </span>
												{period.teacher?.name || 'Not assigned'}
											</div>
											{period.warning && (
												<div className="text-xs text-red-500 mt-1">{period.warning}</div>
											)}
										</div>
									) : null}
								</div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);

	const renderDoublePeriodsSummary = () => {
		if (!selectedTimetable.schedule) return null;

		const doublePeriods = [];

		selectedTimetable.schedule.forEach((day) => {
			day.periods?.forEach((period) => {
				if (isDoublePeriod(period) && period.subject) {
					doublePeriods.push({
						day: day.day,
						periodNumber: period.periodNumber,
						subject: period.subject.name,
						teacher: period.teacher?.name,
						time: `${formatTime(period.startTime)} - ${formatTime(period.endTime)}`,
						duration:
							(new Date(`2000-01-01T${period.endTime}`) -
								new Date(`2000-01-01T${period.startTime}`)) /
							(1000 * 60),
					});
				}
			});
		});

		if (doublePeriods.length === 0) return null;

		return (
			<div className="mt-8 bg-gray-50 p-4 rounded-lg">
				<h3 className="text-lg font-bold mb-3 text-purple-800">Double Periods Summary</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{doublePeriods.map((dp, index) => (
						<div key={index} className="bg-white p-3 rounded border border-purple-100">
							<div className="font-medium text-purple-700">{dp.day}</div>
							<div className="text-sm">
								<span className="text-gray-600">Period:</span> {dp.periodNumber}
							</div>
							<div className="text-sm">
								<span className="text-gray-600">Time:</span> {dp.time}
							</div>
							<div className="text-sm">
								<span className="text-gray-600">Duration:</span> {dp.duration} mins
							</div>
							<div className="text-sm">
								<span className="text-gray-600">Subject:</span> {dp.subject}
							</div>
							{dp.teacher && (
								<div className="text-sm">
									<span className="text-gray-600">Teacher:</span> {dp.teacher}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
			{' '}
			{/* Changed to relative positioning */}
			<FullMenu />
			<div className="p-4 max-w-full pt-20">
				{' '}
				{/* Added pt-20 to account for menu button */}
				<h1 className="text-2xl font-bold text-white mb-6">{user}'s Timetables</h1>
				{renderClassTabs()}
				<div className="bg-white rounded-lg shadow-sm p-4">
					{renderDesktopView()}
					{renderMobileView()}
					{renderDoublePeriodsSummary()}
				</div>
			</div>
		</div>
	);
};

export default Timetables;
