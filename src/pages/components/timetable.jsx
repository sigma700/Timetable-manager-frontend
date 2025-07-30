import React, { useState } from 'react';

const Timetable = ({ timetableResponse }) => {
	if (!timetableResponse || !timetableResponse.success) {
		return <div className="p-4 text-red-500">Error loading timetable data</div>;
	}

	const { timetables } = timetableResponse.data;
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
	const { name, schedule, config } = timetable;

	// Helper function to format time
	const formatTime = (timeStr) => {
		const [hours, minutes] = timeStr.split(':');
		const hour = parseInt(hours, 10);
		return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">{name.replace('Timetable for ', '')}</h2>

			{/* Desktop View */}
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
						{Array.from({ length: config.periodsPerDay }).map((_, periodIdx) => {
							const periodNumber = periodIdx + 1;

							// Find first period with this number to get the time
							const firstPeriod = schedule[0].periods.find((p) => p.periodNumber === periodNumber);
							const periodTime = firstPeriod
								? `${formatTime(firstPeriod.startTime)} - ${formatTime(firstPeriod.endTime)}`
								: `Period ${periodNumber}`;

							return (
								<tr key={`period-${periodNumber}`}>
									<td className="border p-2 bg-gray-50 text-center">{periodTime}</td>

									{schedule.map((day) => {
										const daySchedule = schedule.find((d) => d.day === day.day);
										const period = daySchedule.periods.find((p) => p.periodNumber === periodNumber);

										if (!period) {
											return <td key={`${day.day}-empty`} className="border p-2"></td>;
										}

										return (
											<td
												key={`${day.day}-${periodNumber}`}
												className={`border p-2 ${period.warning ? 'bg-red-50' : 'bg-white'}`}
											>
												{period.subject && (
													<>
														<div className="font-medium">{period.subject.name}</div>
														<div className="text-sm text-gray-600">
															{period.teacher?.name || 'No teacher'}
														</div>
														{period.warning && (
															<div className="text-xs text-red-500 mt-1">{period.warning}</div>
														)}
													</>
												)}
											</td>
										);
									})}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			{/* Mobile View */}
			<div className="md:hidden space-y-4">
				{schedule.map((day) => (
					<div key={day.day} className="border rounded-lg overflow-hidden">
						<h3 className="bg-gray-100 p-3 font-bold text-lg">{day.day}</h3>
						<div className="divide-y">
							{day.periods.map((period) => (
								<div
									key={`${day.day}-period-${period.periodNumber}`}
									className={`p-3 ${period.warning ? 'bg-red-50' : 'bg-white'}`}
								>
									<div className="flex justify-between items-start">
										<div>
											<span className="font-medium">Period {period.periodNumber}: </span>
											<span>
												{formatTime(period.startTime)} - {formatTime(period.endTime)}
											</span>
										</div>
										{period.subject && (
											<span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
												{period.subject.name}
											</span>
										)}
									</div>

									{period.subject && (
										<div className="mt-2">
											<div className="text-sm">
												<span className="text-gray-600">Teacher: </span>
												{period.teacher?.name || 'Not assigned'}
											</div>
											{period.warning && (
												<div className="text-xs text-red-500 mt-1">{period.warning}</div>
											)}
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Timetable;
