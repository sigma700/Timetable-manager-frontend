import React, { useState } from 'react';

const Timetable = ({ timetableResponse }) => {
	if (!timetableResponse) {
		return (
			<div className="p-4 text-center text-red-500">Error: No timetable response received</div>
		);
	}

	if (!timetableResponse.success) {
		return (
			<div className="p-4 text-center text-red-500">
				Error: {timetableResponse.message || 'Failed to generate timetable'}
			</div>
		);
	}

	if (!timetableResponse.data) {
		return <div className="p-4 text-center text-gray-500">No timetable data available</div>;
	}

	if (!timetableResponse.data.timetables || !Array.isArray(timetableResponse.data.timetables)) {
		return <div className="p-4 text-center text-gray-500">Timetable structure is invalid</div>;
	}

	const { timetables } = timetableResponse.data;

	if (timetables.length === 0) {
		return <div className="p-4 text-center text-gray-500">No timetables generated</div>;
	}

	const [selectedClass, setSelectedClass] = useState(timetables[0].name);
	const selectedTimetable = timetables.find((t) => t.name === selectedClass) || timetables[0];

	return (
		<div className="p-4 max-w-full">
			<ClassSelector
				timetables={timetables}
				selectedClass={selectedClass}
				onChange={setSelectedClass}
			/>
			<TimetableView timetable={selectedTimetable} />
		</div>
	);
};

const ClassSelector = ({ timetables, selectedClass, onChange }) => {
	return (
		<div className="mb-6">
			<label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">
				Select Class:
			</label>
			<select
				id="class-select"
				value={selectedClass}
				onChange={(e) => onChange(e.target.value)}
				className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
			>
				{timetables.map((timetable) => (
					<option key={timetable.name} value={timetable.name}>
						{timetable.name.replace('Timetable for ', '')}
					</option>
				))}
			</select>
		</div>
	);
};

const TimetableView = ({ timetable }) => {
	if (!timetable || !timetable.schedule || !timetable.config) {
		return <div className="p-4 text-center text-red-500">Invalid timetable structure</div>;
	}

	const { name, schedule, config } = timetable;

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
		return duration > 45; // Assuming normal period is 40 mins
	};

	const renderDesktopView = () => (
		<div className="hidden md:block overflow-x-auto">
			<table className="w-full border-collapse">
				<thead>
					<tr>
						<th className="border p-2 bg-gray-100 min-w-[120px]">Time</th>
						{schedule.map((day) => (
							<th key={day.day} className="border p-2 bg-gray-100 min-w-[150px]">
								{day.day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{schedule[0].periods.map((_, periodIdx) => {
						const period = schedule[0].periods[periodIdx];
						const periodTime = period
							? `${formatTime(period.startTime)} - ${formatTime(period.endTime)}`
							: `Period ${periodIdx + 1}`;

						return (
							<tr key={`period-${periodIdx}`}>
								<td className="border p-2 bg-gray-50 text-center">{periodTime}</td>
								{schedule.map((day) => {
									const currentPeriod = day.periods[periodIdx];
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
			{schedule.map((day) => (
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
		const doublePeriods = [];

		schedule.forEach((day) => {
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
		<div>
			<h2 className="text-xl font-bold mb-4">
				{name?.replace('Timetable for ', '') || 'Timetable'}
			</h2>
			{renderDesktopView()}
			{renderMobileView()}
			{renderDoublePeriodsSummary()}
		</div>
	);
};

export default Timetable;
