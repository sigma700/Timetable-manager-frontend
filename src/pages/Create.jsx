import React, { useState } from 'react';
import { FullMenu } from './components/animatedHamb';
import { useGenStore } from '../store/generativeStore';

const Create = () => {
	const [schoolName, setSchoolName] = useState('');
	const [subjectName, setSubjectName] = useState('');
	const [schoolId, setSchoolId] = useState('');
	const [minLevel, setMinLevel] = useState('');
	const [maxLevel, setMaxLevel] = useState('');
	const [classLabels, setLabels] = useState('');
	const [classTypes, setClassTypes] = useState('');
	const [tichNames, setTichName] = useState('');

	const [tichSubjects, setTichSubjects] = useState('');
	const [tichClasses, setTichClasses] = useState('');
	const { listName, listSubs, listClasses, listTichs, isLoading, error, isCreated } = useGenStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const schoolData = await listName(schoolName);
			const createdSchoolId = schoolData.data._id;

			const subjectsArray = subjectName
				.split(',')
				.map((subject) => subject.trim())
				.filter((subject) => subject.length > 0);

			await listSubs(subjectsArray, createdSchoolId);
			await listClasses(minLevel, maxLevel, classLabels, classTypes, createdSchoolId);
			await listTichs(tichNames, tichClasses, tichSubjects, createdSchoolId);
			setSchoolId(createdSchoolId);
		} catch (error) {}
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
						<label className="block mb-2 text-sm font-semibold" htmlFor="schoolName">
							School Name
						</label>
						<Input
							onChange={(e) => setSchoolName(e.target.value)}
							type="text"
							value={schoolName}
							placeholder="Enter school name"
						/>
					</div>

					{/* Subjects Taught */}
					<div>
						<label className="block mb-2 text-sm font-semibold" htmlFor="subjects">
							Subjects Taught
						</label>
						<Input
							onChange={(e) => setSubjectName(e.target.value)}
							type="text"
							value={subjectName}
							placeholder="e.g. Math, English, Science"
						/>
						<p className="text-xs text-slate-400 mt-1">Separate subjects with commas</p>
					</div>

					{/* Teachers and Subjects */}
					<div>
						<label className="block mb-2 text-sm font-semibold">Teachers & Subjects</label>
						<Input
							onChange={(e) => setTichSubjects(e.target.value)}
							type="text"
							value={tichSubjects}
							placeholder="e.g. Mr. Smith - Math, Ms. Jane - English"
						/>
						<p className="text-xs text-slate-400 mt-1">
							Format: Name - Subject, separate with commas
						</p>
					</div>

					{/* Classes Info */}
					<div className="bg-slate-700 p-4 rounded-lg">
						<label className="block mb-2 text-sm font-semibold">Classes Info</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<label className="block mb-1 text-xs" htmlFor="classType">
									Type
								</label>
								<Input
									onChange={(e) => setClassTypes(e.target.value)}
									value={classTypes}
									type="text"
									placeholder="e.g. Grade or Class"
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs" htmlFor="minLevel">
									Min Level
								</label>
								<Input
									onChange={(e) => setMinLevel(e.target.value)}
									value={minLevel}
									type="number"
									placeholder="e.g. 1"
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs" htmlFor="maxLevel">
									Max Level
								</label>
								<Input
									onChange={(e) => setMaxLevel(e.target.value)}
									value={maxLevel}
									type="number"
									placeholder="e.g. 9"
								/>
							</div>
							<div>
								<label className="block mb-1 text-xs" htmlFor="labels">
									Labels
								</label>
								<Input
									onChange={(e) => setLabels(e.target.value)}
									value={classLabels}
									type="text"
									placeholder="e.g. a, b, c, d"
								/>
								<p className="text-xs text-slate-400 mt-1">Separate labels with commas</p>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="mt-4 py-2 px-6 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg text-white font-bold hover:scale-105 transition-transform hover:cursor-pointer"
					>
						Submit
					</button>
				</form>
			</div>
		</main>
	);
};

const Input = ({ type, placeholder, onChange, value }) => {
	return (
		<input
			onChange={onChange}
			className="bg-gray-700 border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 text-white placeholder-gray-400 transition-all duration-200 outline-none w-full"
			type={type}
			value={value}
			placeholder={placeholder}
		/>
	);
};

export default Create;
