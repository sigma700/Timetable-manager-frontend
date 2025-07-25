import React, { useState } from 'react';
import { useGenStore } from '../store/generativeStore';

const InputField = ({
	type,
	name,
	placeholder,
	required,
	min,
	max,
	label,
	className,
	value,
	onChange,
}) => {
	return (
		<div className={`mb-4 ${className}`}>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				type={type}
				name={name}
				placeholder={placeholder}
				required={required}
				min={min}
				max={max}
				value={value} // This makes the input "controlled" by React state
				onChange={onChange} // This function updates the state when the input changes
				className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
			/>
		</div>
	);
};

// Reusable Select Component
// Now accepts 'value' and 'onChange' props to make it controllable by React state
const SelectField = ({
	label,
	name,
	options,
	required = false,
	className = '',
	value,
	onChange,
}) => (
	<div className={`mb-4 ${className}`}>
		<label className="block text-sm font-medium text-gray-700 mb-1">
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<select
			name={name}
			required={required}
			value={value} // This makes the select "controlled" by React state
			onChange={onChange} // This function updates the state when the select changes
			className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
		>
			<option value="">Select {label}</option>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	</div>
);

const Generation = () => {
	const { isloading, error, isCreated, generateTabel, idOfSchool } = useGenStore();
	const initialFormData = {
		name: '',
		school: '',
		startTime: '',
		periodsPerDay: '',
		periodDuration: '',
		breaks: [], // Array for dynamic breaks
		doublePeriods: [], // Array for dynamic double periods
	};

	// Use one state variable for the entire form data
	const [formData, setFormData] = useState(initialFormData);

	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const handleConfigChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			[name]: value,
		}));
	};

	const addBreak = () => {
		setFormData((prevFormData) => ({
			...prevFormData,
			breaks: [
				...prevFormData.breaks,
				{
					id: crypto.randomUUID(),
					name: '',
					afterPeriod: '',
					duration: '',
				},
			],
		}));
	};

	// Function to Handle Changes in a Break's Input Fields
	const handleBreakChange = (id, e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			breaks: prevFormData.breaks.map((breakItem) =>
				breakItem.id === id ? { ...breakItem, [name]: value } : breakItem
			),
		}));
	};

	// Function to Remove a Break
	const removeBreak = (idToRemove) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			breaks: prevFormData.breaks.filter((breakItem) => breakItem.id !== idToRemove),
		}));
	};

	// Function to Add a New Double Period
	const addDoublePeriod = () => {
		setFormData((prevFormData) => ({
			...prevFormData,
			doublePeriods: [
				...prevFormData.doublePeriods,
				{
					id: crypto.randomUUID(), // Unique ID for each double period
					day: '',
					period: '',
				},
			],
		}));
	};

	// Function to Handle Changes in a Double Period's Input Fields
	const handleDoublePeriodChange = (id, e) => {
		const { name, value } = e.target;
		setFormData((prevFormData) => ({
			...prevFormData,
			doublePeriods: prevFormData.doublePeriods.map((dpItem) =>
				dpItem.id === id ? { ...dpItem, [name]: value } : dpItem
			),
		}));
	};

	const removeDoublePeriod = (idToRemove) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			doublePeriods: prevFormData.doublePeriods.filter((dpItem) => dpItem.id !== idToRemove),
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const config = {
				periodsPerDay: formData.periodsPerDay ? parseInt(formData.periodsPerDay) : undefined,
				periodDuration: formData.periodDuration ? parseInt(formData.periodDuration) : undefined,
				startTime: formData.startTime || undefined,
				breaks: formData.breaks
					.filter((breakItem) => breakItem.name)
					.map((breakItem) => ({
						name: breakItem.name,
						afterPeriod: breakItem.afterPeriod ? parseInt(breakItem.afterPeriod) : undefined,
						duration: breakItem.duration ? parseInt(breakItem.duration) : undefined,
					})),
				doublePeriods: formData.doublePeriods
					.filter((dp) => dp.day && dp.period)
					.map((dp) => ({
						day: dp.day,
						period: dp.period ? parseInt(dp.period) : undefined,
					})),
			};

			const submissionData = {
				name: formData.name,
				school: formData.school || undefined,
				config,
			};

			console.log('Submitting:', submissionData);

			await generateTabel(config, formData.school);
		} catch (error) {
			console.error('Submission error:', error);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
			<div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden">
				<h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
					Create New Timetable Configuration
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<InputField
							label="School Name"
							name="name"
							placeholder="Enter school name"
							required
							value={formData.name}
							onChange={handleChange}
						/>
						<InputField
							label="School ID"
							name="school"
							placeholder="Enter school ID"
							value={formData.school}
							onChange={handleChange}
						/>
						<InputField
							label="Start Time"
							type="time"
							name="startTime"
							placeholder="08:00"
							required
							value={formData.startTime}
							onChange={handleConfigChange}
						/>
						<InputField
							label="Periods Per Day"
							type="number"
							name="periodsPerDay"
							placeholder="7"
							min="1"
							max="12"
							required
							value={formData.periodsPerDay} // Connected to state
							onChange={handleConfigChange} // Updates state
						/>
						<InputField
							label="Period Duration (minutes)"
							type="number"
							name="periodDuration"
							placeholder="40"
							min="5"
							max="120"
							required
							value={formData.periodDuration} // Connected to state
							onChange={handleConfigChange} // Updates state
						/>
					</div>

					{/* Breaks Section - Already Dynamic and Typable */}
					<div className="mb-8 p-4 bg-gray-50 rounded-lg">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-700">Breaks</h3>
							<button
								type="button"
								onClick={addBreak}
								className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium"
							>
								Add Break
							</button>
						</div>

						{formData.breaks.map((breakItem) => (
							<div
								key={breakItem.id}
								className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded-md shadow-sm border border-gray-200"
							>
								<InputField
									label="Break Name"
									name="name"
									placeholder="e.g., Lunch Break"
									required
									value={breakItem.name}
									onChange={(e) => handleBreakChange(breakItem.id, e)}
								/>

								<InputField
									label="After Period"
									type="number"
									name="afterPeriod"
									placeholder="2"
									min="1"
									max="12"
									required
									value={breakItem.afterPeriod}
									onChange={(e) => handleBreakChange(breakItem.id, e)}
								/>

								<InputField
									label="Duration (minutes)"
									type="number"
									name="duration"
									placeholder="15"
									min="1"
									max="60"
									required
									value={breakItem.duration}
									onChange={(e) => handleBreakChange(breakItem.id, e)}
								/>

								<div className="flex items-end">
									<button
										type="button"
										onClick={() => removeBreak(breakItem.id)}
										className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium w-full"
									>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Double Periods Section - NOW DYNAMIC AND TYPABLE! */}
					<div className="mb-8 p-4 bg-gray-50 rounded-lg">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-700">Double Periods</h3>
							<button
								type="button"
								onClick={addDoublePeriod}
								className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium"
							>
								Add Double Period
							</button>
						</div>

						{formData.doublePeriods.map((dpItem) => (
							<div
								key={dpItem.id}
								className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-white rounded-md shadow-sm border border-gray-200"
							>
								<SelectField
									label="Day"
									name="day"
									options={daysOfWeek.map((day) => ({ value: day, label: day }))}
									required
									value={dpItem.day}
									onChange={(e) => handleDoublePeriodChange(dpItem.id, e)}
								/>

								<InputField
									label="Period Number"
									type="number"
									name="period"
									placeholder="1"
									min="1"
									max="12"
									required
									value={dpItem.period}
									onChange={(e) => handleDoublePeriodChange(dpItem.id, e)}
								/>

								<div className="flex items-end">
									<button
										type="button"
										onClick={() => removeDoublePeriod(dpItem.id)}
										className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium w-full"
									>
										Remove
									</button>
								</div>
							</div>
						))}
					</div>

					{/* Save Configuration Button (still static, but would submit formData) */}
					<div className="mt-6">
						<button
							type="submit"
							className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 font-medium"
						>
							Save Configuration
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Generation;
