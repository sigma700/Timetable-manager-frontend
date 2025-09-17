import React, { useState, useEffect } from 'react';
import { FullMenu } from './components/animatedHamb';
import { useGenStore } from '../store/generativeStore';
import LoadingSpinner from './components/spinner';
import Notification from './components/notification';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Create = () => {
	const [formData, setFormData] = useState({
		schoolName: '',
		subjectName: '',
		minLevel: '',
		maxLevel: '',
		classTypes: '',
		classLabels: '',
		teachers: [{ name: '', subjects: '', classes: '' }],
	});

	const [dropdownsOpen, setDropdownsOpen] = useState({
		classType: false,
		subject: Array(formData.teachers.length).fill(false),
		class: Array(formData.teachers.length).fill(false),
	});

	const [localError, setLocalError] = useState(null);
	const { listName, listSubs, listClasses, listTichs, isLoading, error } = useGenStore();

	const navigate = useNavigate();

	useEffect(() => {
		if (error) {
			setLocalError(error);
			const timer = setTimeout(() => setLocalError(null), 8000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleTeacherChange = (index, field, value) => {
		const updatedTeachers = [...formData.teachers];
		updatedTeachers[index][field] = value;
		setFormData((prev) => ({ ...prev, teachers: updatedTeachers }));
	};

	const addTeacher = () => {
		setFormData((prev) => ({
			...prev,
			teachers: [...prev.teachers, { name: '', subjects: '', classes: '' }],
		}));

		// Add dropdown state for new teacher
		setDropdownsOpen((prev) => ({
			...prev,
			subject: [...prev.subject, false],
			class: [...prev.class, false],
		}));
	};

	const removeTeacher = (index) => {
		if (formData.teachers.length > 1) {
			setFormData((prev) => ({
				...prev,
				teachers: prev.teachers.filter((_, i) => i !== index),
			}));

			// Remove dropdown state for removed teacher
			setDropdownsOpen((prev) => ({
				...prev,
				subject: prev.subject.filter((_, i) => i !== index),
				class: prev.class.filter((_, i) => i !== index),
			}));
		}
	};

	const toggleDropdown = (type, index = null) => {
		if (type === 'classType') {
			setDropdownsOpen((prev) => ({
				...prev,
				classType: !prev.classType,
				subject: prev.subject.map(() => false),
				class: prev.class.map(() => false),
			}));
		} else if (type === 'subject') {
			const newSubjectState = [...dropdownsOpen.subject];
			newSubjectState[index] = !newSubjectState[index];
			setDropdownsOpen((prev) => ({
				...prev,
				subject: newSubjectState,
				classType: false,
			}));

			// Close class dropdown if opening subject dropdown
			if (newSubjectState[index]) {
				const newClassState = [...dropdownsOpen.class];
				newClassState[index] = false;
				setDropdownsOpen((prev) => ({ ...prev, class: newClassState }));
			}
		} else {
			const newClassState = [...dropdownsOpen.class];
			newClassState[index] = !newClassState[index];
			setDropdownsOpen((prev) => ({
				...prev,
				class: newClassState,
				classType: false,
			}));

			// Close subject dropdown if opening class dropdown
			if (newClassState[index]) {
				const newSubjectState = [...dropdownsOpen.subject];
				newSubjectState[index] = false;
				setDropdownsOpen((prev) => ({ ...prev, subject: newSubjectState }));
			}
		}
	};

	const handleClassTypeSelect = (type) => {
		setFormData((prev) => ({ ...prev, classTypes: type }));
		setDropdownsOpen((prev) => ({ ...prev, classType: false }));
	};

	const handleSubjectSelect = (index, subject) => {
		const currentSubjects = formData.teachers[index].subjects;
		const subjectsArray = currentSubjects ? currentSubjects.split(',').map((s) => s.trim()) : [];

		// Toggle subject selection
		if (subjectsArray.includes(subject)) {
			// Remove subject if already selected
			const updatedSubjects = subjectsArray.filter((s) => s !== subject).join(', ');
			handleTeacherChange(index, 'subjects', updatedSubjects);
		} else {
			// Add subject if not selected
			const updatedSubjects = [...subjectsArray, subject].join(', ');
			handleTeacherChange(index, 'subjects', updatedSubjects);
		}
	};

	const handleClassSelect = (index, classItem) => {
		const currentClasses = formData.teachers[index].classes;
		const classesArray = currentClasses ? currentClasses.split(',').map((c) => c.trim()) : [];

		// Toggle class selection
		if (classesArray.includes(classItem)) {
			// Remove class if already selected
			const updatedClasses = classesArray.filter((c) => c !== classItem).join(', ');
			handleTeacherChange(index, 'classes', updatedClasses);
		} else {
			// Add class if not selected
			const updatedClasses = [...classesArray, classItem].join(', ');
			handleTeacherChange(index, 'classes', updatedClasses);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLocalError(null);

			// Basic validation
			if (!formData.schoolName.trim()) {
				throw new Error('School name is required');
			}
			if (!formData.minLevel || !formData.maxLevel) {
				throw new Error('Class levels are required');
			}

			// Create school
			const schoolData = await listName(formData.schoolName);
			const schoolId = schoolData.data._id;

			// Process subjects
			const subjectsArray = formData.subjectName
				.split(',')
				.map((s) => s.trim())
				.filter((s) => s);
			await listSubs(subjectsArray, schoolId);

			// Process classes
			await listClasses(
				formData.minLevel.toString(),
				formData.maxLevel.toString(),
				formData.classTypes,
				formData.classLabels
					.split(',')
					.map((label) => label.trim())
					.filter((label) => label),
				schoolId
			);

			// Process teachers
			await Promise.all(
				formData.teachers.map((teacher) => {
					const subjectNames = teacher.subjects
						.split(',')
						.map((s) => s.trim())
						.filter((s) => s);

					const classNames = teacher.classes
						.split(',')
						.map((c) => c.trim())
						.filter((c) => c);

					return listTichs(teacher.name, subjectNames, classNames, schoolId);
				})
			);
			navigate('/home/gentable');
		} catch (error) {
			console.error('Submission failed:', error);
			setLocalError(error.message);
		}
	};

	// Generate class options based on form data
	const generateClassOptions = () => {
		const options = [];
		const minLevel = parseInt(formData.minLevel) || 0;
		const maxLevel = parseInt(formData.maxLevel) || 0;
		const classLabels = formData.classLabels
			.split(',')
			.map((label) => label.trim().toUpperCase())
			.filter((label) => label);

		if (minLevel && maxLevel && minLevel <= maxLevel && formData.classTypes) {
			for (let level = minLevel; level <= maxLevel; level++) {
				if (classLabels.length > 0) {
					classLabels.forEach((label) => {
						options.push(`${formData.classTypes} ${level}${label}`);
					});
				} else {
					options.push(`${formData.classTypes} ${level}`);
				}
			}
		}

		return options;
	};

	const subjectOptions = formData.subjectName
		.split(',')
		.map((subject) => subject.trim())
		.filter((subject) => subject);

	const classOptions = generateClassOptions();
	const classTypeOptions = ['Grade', 'Class', 'Form'];

	// Background animation variants
	const floatingShapes = {
		animate: {
			y: [0, -20, 0],
			transition: {
				y: {
					repeat: Infinity,
					duration: 6,
					ease: 'easeInOut',
				},
			},
		},
	};

	return (
		<main className="text-white relative h-screen bg-gradient-to-r from-slate-900 to-slate-900 overflow-auto">
			{/* Animated Background Elements */}
			<motion.div
				className="absolute top-20 left-10 w-20 h-20 rounded-full bg-blue-900/20 blur-xl"
				variants={floatingShapes}
				animate="animate"
				style={{ originX: 0.5, originY: 0.5 }}
			/>
			<motion.div
				className="absolute top-1/3 right-16 w-16 h-16 rounded-full bg-purple-900/20 blur-xl"
				variants={floatingShapes}
				animate="animate"
				transition={{ delay: 0.5 }}
				style={{ originX: 0.5, originY: 0.5 }}
			/>
			<motion.div
				className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-slate-800/30 blur-xl"
				variants={floatingShapes}
				animate="animate"
				transition={{ delay: 1 }}
				style={{ originX: 0.5, originY: 0.5 }}
			/>

			{/* Animated grid pattern */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

			<FullMenu />
			<div className="h-full w-full flex flex-col absolute top-1/9 items-center z-0 p-[5px]">
				{/* Notification for errors */}
				{localError && (
					<div className="w-full max-w-2xl mb-4">
						<Notification
							message={localError}
							type="error"
							duration={8000}
							onClose={() => setLocalError(null)}
						/>
					</div>
				)}

				<motion.form
					onSubmit={handleSubmit}
					className="max-w-2xl mx-auto p-6 bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-lg flex flex-col gap-6 relative z-10"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* School Name */}
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
						<label className="block mb-2 text-sm font-semibold">School Name</label>
						<Input
							name="schoolName"
							value={formData.schoolName}
							onChange={handleChange}
							placeholder="Enter school name"
							required
						/>
					</motion.div>

					{/* Subjects Taught */}
					<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
						<label className="block mb-2 text-sm font-semibold">Subjects Taught</label>
						<Input
							name="subjectName"
							value={formData.subjectName}
							onChange={handleChange}
							placeholder="Math, English, Science"
						/>
						<p className="text-xs text-slate-400 mt-1">Separate subjects with commas</p>
					</motion.div>

					{/* Classes Info */}
					<motion.div
						className="bg-slate-700/50 p-4 rounded-lg"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						<label className="block mb-2 text-sm font-semibold">Classes Info</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Class Type Dropdown */}
							<div className="relative">
								<label className="block mb-1 text-xs">Type</label>
								<div
									className="bg-gray-700 border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 text-white placeholder-gray-400 transition-all duration-200 outline-none w-full cursor-pointer flex justify-between items-center"
									onClick={() => toggleDropdown('classType')}
								>
									<span className={formData.classTypes ? '' : 'text-gray-400'}>
										{formData.classTypes || 'Select type'}
									</span>
									<motion.svg
										animate={{ rotate: dropdownsOpen.classType ? 180 : 0 }}
										transition={{ duration: 0.3 }}
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</motion.svg>
								</div>

								<AnimatePresence>
									{dropdownsOpen.classType && (
										<motion.div
											className="absolute z-20 mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg"
											initial={{ opacity: 0, y: -10 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -10 }}
											transition={{ duration: 0.2 }}
										>
											{classTypeOptions.map((type, i) => (
												<motion.div
													key={i}
													className={`p-2 cursor-pointer hover:bg-slate-700 ${
														formData.classTypes === type ? 'bg-slate-600' : ''
													}`}
													onClick={() => handleClassTypeSelect(type)}
													whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
												>
													{type}
												</motion.div>
											))}
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							<div>
								<label className="block mb-1 text-xs">Min Level</label>
								<Input
									name="minLevel"
									type="number"
									value={formData.minLevel}
									onChange={handleChange}
									placeholder="1"
									required
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs">Max Level</label>
								<Input
									name="maxLevel"
									type="number"
									value={formData.maxLevel}
									onChange={handleChange}
									placeholder="9"
									required
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs">Labels</label>
								<Input
									name="classLabels"
									value={formData.classLabels}
									onChange={handleChange}
									placeholder="A, B, C"
								/>
								<p className="text-xs text-slate-400 mt-1">
									Separate labels with commas (will be converted to uppercase)
								</p>
							</div>
						</div>
					</motion.div>

					{/* Teachers Section */}
					<motion.div
						className="space-y-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<label className="block mb-2 text-sm font-semibold">Teachers</label>

						{formData.teachers.map((teacher, index) => (
							<motion.div
								key={index}
								className="bg-slate-700/50 p-4 rounded-lg space-y-3"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div>
										<label className="block mb-1 text-xs">Name</label>
										<Input
											value={teacher.name}
											onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
											placeholder="eg: Mr. Smith"
											required
										/>
									</div>

									{/* Subjects Dropdown */}
									<div className="relative">
										<label className="block mb-1 text-xs">Subjects</label>
										<div
											className="bg-gray-700 border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 text-white placeholder-gray-400 transition-all duration-200 outline-none w-full cursor-pointer flex justify-between items-center"
											onClick={() => toggleDropdown('subject', index)}
										>
											<span className={teacher.subjects ? '' : 'text-gray-400'}>
												{teacher.subjects || 'Select subjects'}
											</span>
											<motion.svg
												animate={{ rotate: dropdownsOpen.subject[index] ? 180 : 0 }}
												transition={{ duration: 0.3 }}
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</motion.svg>
										</div>

										<AnimatePresence>
											{dropdownsOpen.subject[index] && (
												<motion.div
													className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto"
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.2 }}
												>
													{subjectOptions.length > 0 ? (
														subjectOptions.map((subject, i) => {
															const isSelected = teacher.subjects.includes(subject);
															return (
																<motion.div
																	key={i}
																	className={`p-2 cursor-pointer hover:bg-slate-700 ${
																		isSelected ? 'bg-slate-600' : ''
																	}`}
																	onClick={() => handleSubjectSelect(index, subject)}
																	whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
																>
																	{subject}
																</motion.div>
															);
														})
													) : (
														<div className="p-2 text-gray-400">No subjects defined above</div>
													)}
												</motion.div>
											)}
										</AnimatePresence>
									</div>

									{/* Classes Dropdown */}
									<div className="relative">
										<label className="block mb-1 text-xs">Classes</label>
										<div
											className="bg-gray-700 border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 text-white placeholder-gray-400 transition-all duration-200 outline-none w-full cursor-pointer flex justify-between items-center"
											onClick={() => toggleDropdown('class', index)}
										>
											<span className={teacher.classes ? '' : 'text-gray-400'}>
												{teacher.classes || 'Select classes'}
											</span>
											<motion.svg
												animate={{ rotate: dropdownsOpen.class[index] ? 180 : 0 }}
												transition={{ duration: 0.3 }}
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M19 9l-7 7-7-7"
												/>
											</motion.svg>
										</div>

										<AnimatePresence>
											{dropdownsOpen.class[index] && (
												<motion.div
													className="absolute z-10 mt-1 w-full bg-slate-800 border border-slate-600 rounded-md shadow-lg max-h-60 overflow-auto"
													initial={{ opacity: 0, y: -10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, y: -10 }}
													transition={{ duration: 0.2 }}
												>
													{classOptions.length > 0 ? (
														classOptions.map((classItem, i) => {
															const isSelected = teacher.classes.includes(classItem);
															return (
																<motion.div
																	key={i}
																	className={`p-2 cursor-pointer hover:bg-slate-700 ${
																		isSelected ? 'bg-slate-600' : ''
																	}`}
																	onClick={() => handleClassSelect(index, classItem)}
																	whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
																>
																	{classItem}
																</motion.div>
															);
														})
													) : (
														<div className="p-2 text-gray-400">Define classes above first</div>
													)}
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
								{formData.teachers.length > 1 && (
									<button
										type="button"
										onClick={() => removeTeacher(index)}
										className="text-xs text-red-400 hover:text-red-300 float-right"
									>
										Remove
									</button>
								)}
							</motion.div>
						))}

						<motion.button
							type="button"
							onClick={addTeacher}
							className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							<svg
								className="w-4 h-4 mr-1"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
							Add Teacher
						</motion.button>
					</motion.div>

					<motion.button
						type="submit"
						className="mt-4 py-2 px-6 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg text-white font-bold hover:scale-105 transition-transform hover:cursor-pointer relative overflow-hidden"
						disabled={isLoading}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						{isLoading ? (
							<div className="flex items-center justify-center">
								<svg
									className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
								Processing...
							</div>
						) : (
							'Submit'
						)}
					</motion.button>
				</motion.form>
			</div>
		</main>
	);
};

const Input = ({ type = 'text', ...props }) => (
	<input
		type={type}
		className="bg-gray-700 border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 text-white placeholder-gray-400 transition-all duration-200 outline-none w-full"
		{...props}
	/>
);

export default Create;
