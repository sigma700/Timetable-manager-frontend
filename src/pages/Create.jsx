import React, { useState } from 'react';
import { FullMenu } from './components/animatedHamb';
import { useGenStore } from '../store/generativeStore';

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

	const { listName, listSubs, listClasses, listTichs, isLoading } = useGenStore();

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
	};

	const removeTeacher = (index) => {
		if (formData.teachers.length > 1) {
			setFormData((prev) => ({
				...prev,
				teachers: prev.teachers.filter((_, i) => i !== index),
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Create school
			const schoolData = await listName(formData.schoolName);
			const schoolId = schoolData.data._id;

			const subjectsArray = formData.subjectName
				.split(',')
				.map((s) => s.trim())
				.filter((s) => s);
			await listSubs(subjectsArray, schoolId);

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
		} catch (error) {
			console.error('Submission failed:', error);
		}
	};

	return (
		<main className="text-white relative h-screen bg-gradient-to-r from-slate-900 to-slate-900 overflow-auto">
			<FullMenu />
			<div className="h-full w-full flex flex-col absolute top-1/9 items-center z-0 p-[5px]">
				<form
					onSubmit={handleSubmit}
					className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg shadow-lg flex flex-col gap-6"
				>
					{/* School Name */}
					<div>
						<label className="block mb-2 text-sm font-semibold">School Name</label>
						<Input
							name="schoolName"
							value={formData.schoolName}
							onChange={handleChange}
							placeholder="Enter school name"
						/>
					</div>

					{/* Subjects Taught */}
					<div>
						<label className="block mb-2 text-sm font-semibold">Subjects Taught</label>
						<Input
							name="subjectName"
							value={formData.subjectName}
							onChange={handleChange}
							placeholder="Math, English, Science"
						/>
						<p className="text-xs text-slate-400 mt-1">Separate subjects with commas</p>
					</div>

					{/* Classes Info */}
					<div className="bg-slate-700 p-4 rounded-lg">
						<label className="block mb-2 text-sm font-semibold">Classes Info</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-xs">Type</label>
								<Input
									name="classTypes"
									value={formData.classTypes}
									onChange={handleChange}
									placeholder="Grade or Class"
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs">Min Level</label>
								<Input
									name="minLevel"
									type="number"
									value={formData.minLevel}
									onChange={handleChange}
									placeholder="1"
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
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs">Labels</label>
								<Input
									name="classLabels"
									value={formData.classLabels}
									onChange={handleChange}
									placeholder="a, b, c"
								/>
								<p className="text-xs text-slate-400 mt-1">Separate labels with commas</p>
							</div>
						</div>
					</div>

					{/* Teachers Section */}
					<div className="space-y-4">
						<label className="block mb-2 text-sm font-semibold">Teachers</label>

						{formData.teachers.map((teacher, index) => (
							<div key={index} className="bg-slate-700 p-4 rounded-lg space-y-3">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
									<div>
										<label className="block mb-1 text-xs">Name</label>
										<Input
											value={teacher.name}
											onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
											placeholder="eg :Mr. Smith"
										/>
									</div>
									<div>
										<label className="block mb-1 text-xs">Subjects</label>
										<Input
											value={teacher.subjects}
											onChange={(e) => handleTeacherChange(index, 'subjects', e.target.value)}
											placeholder="Math, Physics"
										/>
									</div>
									<div>
										<label className="block mb-1 text-xs">Classes</label>
										<Input
											value={teacher.classes}
											onChange={(e) => handleTeacherChange(index, 'classes', e.target.value)}
											placeholder="Grade 9, Grade 10"
										/>
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
							</div>
						))}

						<button
							type="button"
							onClick={addTeacher}
							className="text-xs text-blue-400 hover:text-blue-300"
						>
							+ Add Teacher
						</button>
					</div>

					<button
						type="submit"
						className="mt-4 py-2 px-6 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg text-white font-bold hover:scale-105 transition-transform hover:cursor-pointer"
						disabled={isLoading}
					>
						{isLoading ? 'Processing...' : 'Submit'}
					</button>
				</form>
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
