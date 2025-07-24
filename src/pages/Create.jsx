import React from 'react';
import { FullMenu } from './components/animatedHamb';

const Create = () => {
	return (
		<main className="text-white relative h-screen bg-gradient-to-r from-slate-900 to-slate-900 overflow-auto">
			<FullMenu />
			<div className="h-full w-full flex flex-col absolute top-1/9 items-center z-0 p-[5px]">
				<form className="max-w-2xl mx-auto p-6 bg-slate-800 rounded-lg shadow-lg flex flex-col gap-6">
					{/* School Name */}
					<div>
						<label className="block mb-2 text-sm font-semibold" htmlFor="schoolName">
							School Name
						</label>
						<Input type="text" placeholder="Enter school name" />
					</div>

					{/* Subjects Taught */}
					<div>
						<label className="block mb-2 text-sm font-semibold" htmlFor="subjects">
							Subjects Taught
						</label>
						<Input type="text" placeholder="e.g. Math, English, Science" />
						<p className="text-xs text-slate-400 mt-1">Separate subjects with commas</p>
					</div>

					{/* Teachers and Subjects */}
					<div>
						<label className="block mb-2 text-sm font-semibold">Teachers & Subjects</label>
						<Input type="text" placeholder="e.g. Mr. Smith - Math, Ms. Jane - English" />
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
								<Input type="text" placeholder="e.g. Grade or Class" />
							</div>
							<div>
								<label className="block mb-1 text-xs" htmlFor="minLevel">
									Min Level
								</label>
								<Input type="number" placeholder="e.g. 1" />
							</div>
							<div>
								<label className="block mb-1 text-xs" htmlFor="maxLevel">
									Max Level
								</label>
								<Input type="number" placeholder="e.g. 9" />
							</div>
							<div>
								<label className="block mb-1 text-xs" htmlFor="labels">
									Labels
								</label>
								<Input type="text" placeholder="e.g. a, b, c, d" />
								<p className="text-xs text-slate-400 mt-1">Separate labels with commas</p>
							</div>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						className="mt-4 py-2 px-6 bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg text-white font-bold hover:scale-105 transition-transform"
					>
						Submit
					</button>
				</form>
			</div>
		</main>
	);
};

const Input = ({ type, placeholder }) => {
	return (
		<input
			className="bg-gray-700 border border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 rounded-lg p-3 text-white placeholder-gray-400 transition-all duration-200 outline-none w-full"
			type={type}
			placeholder={placeholder}
		/>
	);
};

export default Create;
