import React, { useState, useEffect } from 'react';
import { useGenStore } from '../store/generativeStore';
import { useAuthStore } from '../store/authStore';

const Timetables = () => {
	// Get all needed values from store
	const { gottenTable, isLoading, error, getTable } = useGenStore();
	const [selectedClass, setSelectedClass] = useState(null);
	const { checkAuth, requiredData, user } = useAuthStore();

	// Fetch data when component mounts
	useEffect(() => {
		const fetchData = async () => {
			try {
				await getTable(requiredData); // REPLACE WITH YOUR ACTUAL TIMETABLE ID
			} catch (err) {
				console.error('Failed to fetch timetable:', err);
			}
		};

		if (!gottenTable && !isLoading) {
			fetchData();
		}
	}, [gottenTable, isLoading, getTable]);

	// Set initial selected class when data loads
	useEffect(() => {
		if (gottenTable?.timetables?.length > 0 && !selectedClass) {
			setSelectedClass(gottenTable.timetables[0].name);
		}
	}, [gottenTable, selectedClass]);

	// Loading state
	if (isLoading) {
		return <div className="p-4 text-center text-gray-500">Loading timetable data...</div>;
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

	// Render functions
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
		<div className="p-4 max-w-full">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">{user}'s Timetables</h1>

			{renderClassTabs()}

			<div className="bg-white rounded-lg shadow-sm p-4">
				{renderDesktopView()}
				{renderMobileView()}
				{renderDoublePeriodsSummary()}
			</div>
		</div>
	);
};

export default Timetables;
