import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Generation = () => {
	// Empty initial data structure
	const initialData = {
		name: '',
		school: '',
		config: {
			periodsPerDay: '',
			periodDuration: '',
			startTime: '',
			breaks: [],
			doublePeriods: [],
		},
	};

	const [formData, setFormData] = useState(initialData);
	const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

	// Reusable Input Component
	const InputField = ({
		label,
		type = 'text',
		name,
		value,
		onChange,
		placeholder = '',
		required = false,
		min,
		max,
		className = '',
	}) => (
		<div className={`mb-4 ${className}`}>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<input
				type={type}
				name={name}
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				required={required}
				min={min}
				max={max}
				className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
			/>
		</div>
	);

	// Reusable Select Component
	const SelectField = ({
		label,
		name,
		value,
		onChange,
		options,
		required = false,
		className = '',
	}) => (
		<div className={`mb-4 ${className}`}>
			<label className="block text-sm font-medium text-gray-700 mb-1">
				{label} {required && <span className="text-red-500">*</span>}
			</label>
			<select
				name={name}
				value={value}
				onChange={onChange}
				required={required}
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

	// Handlers
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleConfigChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			config: {
				...prev.config,
				[name]:
					name === 'periodsPerDay' || name === 'periodDuration' ? parseInt(value) || '' : value,
			},
		}));
	};

	const handleBreakChange = (index, e) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			const updatedBreaks = [...prev.config.breaks];
			updatedBreaks[index] = {
				...updatedBreaks[index],
				[name]: name === 'afterPeriod' || name === 'duration' ? parseInt(value) || '' : value,
			};
			return {
				...prev,
				config: {
					...prev.config,
					breaks: updatedBreaks,
				},
			};
		});
	};

	const handleDoublePeriodChange = (index, e) => {
		const { name, value } = e.target;
		setFormData((prev) => {
			const updatedDoublePeriods = [...prev.config.doublePeriods];
			updatedDoublePeriods[index] = {
				...updatedDoublePeriods[index],
				[name]: name === 'period' ? parseInt(value) || '' : value,
			};
			return {
				...prev,
				config: {
					...prev.config,
					doublePeriods: updatedDoublePeriods,
				},
			};
		});
	};

	const addBreak = () => {
		setFormData((prev) => ({
			...prev,
			config: {
				...prev.config,
				breaks: [...prev.config.breaks, { name: '', afterPeriod: '', duration: '' }],
			},
		}));
	};

	const removeBreak = (index) => {
		setFormData((prev) => ({
			...prev,
			config: {
				...prev.config,
				breaks: prev.config.breaks.filter((_, i) => i !== index),
			},
		}));
	};

	const addDoublePeriod = () => {
		setFormData((prev) => ({
			...prev,
			config: {
				...prev.config,
				doublePeriods: [...prev.config.doublePeriods, { day: '', period: '' }],
			},
		}));
	};

	const removeDoublePeriod = (index) => {
		setFormData((prev) => ({
			...prev,
			config: {
				...prev.config,
				doublePeriods: prev.config.doublePeriods.filter((_, i) => i !== index),
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Prepare data for database (convert empty strings to null/undefined if needed)
		const submissionData = {
			...formData,
			school: formData.school || undefined, // Send undefined if empty
			config: {
				...formData.config,
				periodsPerDay: formData.config.periodsPerDay || undefined,
				periodDuration: formData.config.periodDuration || undefined,
				startTime: formData.config.startTime || undefined,
				breaks: formData.config.breaks.filter((b) => b.name), // Only keep breaks with names
				doublePeriods: formData.config.doublePeriods.filter((dp) => dp.day && dp.period), // Only keep complete double periods
			},
		};

		console.log('Data ready for database:', submissionData);

		// Here you would typically send the data to your backend
		// Example:
		/*
    try {
      const response = await fetch('/api/timetable-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      const result = await response.json();
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration');
    }
    */

		alert(JSON.stringify(submissionData, null, 2));
	};

	return (
		<div className="min-h-screen bg-gray-100 py-8 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md overflow-hidden"
			>
				<h2 className="text-2xl font-bold text-gray-800 mb-6">
					Create New Timetable Configuration
				</h2>

				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<InputField
							label="School Name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							placeholder="Enter school name"
							required
						/>

						<InputField
							label="School ID"
							name="school"
							value={formData.school}
							onChange={handleChange}
							placeholder="Enter school ID"
						/>

						<InputField
							label="Start Time"
							type="time"
							name="startTime"
							value={formData.config.startTime}
							onChange={handleConfigChange}
							placeholder="08:00"
							required
						/>

						<InputField
							label="Periods Per Day"
							type="number"
							name="periodsPerDay"
							value={formData.config.periodsPerDay}
							onChange={handleConfigChange}
							placeholder="7"
							min="1"
							max="12"
							required
						/>

						<InputField
							label="Period Duration (minutes)"
							type="number"
							name="periodDuration"
							value={formData.config.periodDuration}
							onChange={handleConfigChange}
							placeholder="40"
							min="5"
							max="120"
							required
						/>
					</div>

					{/* Breaks Section */}
					<motion.div layout className="mb-8 p-4 bg-gray-50 rounded-lg">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-700">Breaks</h3>
							<motion.button
								type="button"
								onClick={addBreak}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium"
							>
								Add Break
							</motion.button>
						</div>

						<AnimatePresence>
							{formData.config.breaks.map((breakItem, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-3 bg-white rounded-md shadow-sm border border-gray-200"
								>
									<InputField
										label="Break Name"
										name="name"
										value={breakItem.name}
										onChange={(e) => handleBreakChange(index, e)}
										placeholder="e.g., Lunch Break"
										required
									/>

									<InputField
										label="After Period"
										type="number"
										name="afterPeriod"
										value={breakItem.afterPeriod}
										onChange={(e) => handleBreakChange(index, e)}
										placeholder="2"
										min="1"
										max={formData.config.periodsPerDay || 12}
										required
									/>

									<InputField
										label="Duration (minutes)"
										type="number"
										name="duration"
										value={breakItem.duration}
										onChange={(e) => handleBreakChange(index, e)}
										placeholder="15"
										min="1"
										max="60"
										required
									/>

									<div className="flex items-end">
										<motion.button
											type="button"
											onClick={() => removeBreak(index)}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium w-full"
										>
											Remove
										</motion.button>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</motion.div>

					{/* Double Periods Section */}
					<motion.div layout className="mb-8 p-4 bg-gray-50 rounded-lg">
						<div className="flex justify-between items-center mb-4">
							<h3 className="text-lg font-semibold text-gray-700">Double Periods</h3>
							<motion.button
								type="button"
								onClick={addDoublePeriod}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium"
							>
								Add Double Period
							</motion.button>
						</div>

						<AnimatePresence>
							{formData.config.doublePeriods.map((dp, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									transition={{ duration: 0.3 }}
									className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-white rounded-md shadow-sm border border-gray-200"
								>
									<SelectField
										label="Day"
										name="day"
										value={dp.day}
										onChange={(e) => handleDoublePeriodChange(index, e)}
										options={daysOfWeek.map((day) => ({ value: day, label: day }))}
										required
									/>

									<InputField
										label="Period Number"
										type="number"
										name="period"
										value={dp.period}
										onChange={(e) => handleDoublePeriodChange(index, e)}
										placeholder="1"
										min="1"
										max={formData.config.periodsPerDay || 12}
										required
									/>

									<div className="flex items-end">
										<motion.button
											type="button"
											onClick={() => removeDoublePeriod(index)}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium w-full"
										>
											Remove
										</motion.button>
									</div>
								</motion.div>
							))}
						</AnimatePresence>
					</motion.div>

					<motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="mt-6">
						<button
							type="submit"
							className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 font-medium"
						>
							Save Configuration
						</button>
					</motion.div>
				</form>
			</motion.div>
		</div>
	);
};

export default Generation;
