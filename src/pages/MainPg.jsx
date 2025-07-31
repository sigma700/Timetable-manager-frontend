import React from 'react';
import { FullMenu } from './components/animatedHamb';
import { useAuthStore } from '../store/authStore';
import HoverDevCards from './components/gridOPtions';
import { Link } from 'react-router-dom';
import { FaTable } from 'react-icons/fa';

const MainPg = () => {
	const { checkAuth, user, genTable, relValue, isLoading } = useAuthStore();

	return (
		<main className="text-white min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
			<FullMenu />
			{/* Main content area */}
			<div className="w-full flex flex-col items-center z-0 p-4 lg:p-8">
				{/* Welcome section with improved styling */}
				<div className="w-full max-w-4xl text-center mb-8">
					<h1 className="font-bold text-3xl lg:text-5xl mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
						Welcome {user}!
					</h1>
					<p className="text-gray-400 text-sm lg:text-base">Manage your schedules efficiently</p>
				</div>

				{/* Action section with subtle glow effect */}
				<div className="w-full max-w-4xl mb-8">
					<div className="styled-container mb-6">
						<h2 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-2">Select Action</h2>
						<div className="w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full"></div>
					</div>
					<div className="w-full">
						<HoverDevCards />
					</div>
				</div>

				{/* View Timetables button with enhanced styling */}
				<div className="w-full max-w-md flex justify-center my-8">
					<Link
						to="timetables"
						className="relative overflow-hidden group p-5 lg:p-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold flex items-center justify-center gap-4 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1"
					>
						<span className="relative z-10">View Timetables</span>
						<FaTable className="relative z-10" />
						<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
					</Link>
				</div>

				{/* Timetables section with improved empty state */}
				<div className="w-full max-w-4xl mt-8">
					<h3 className="text-xl lg:text-2xl font-semibold text-gray-300 mb-4 text-center">
						Your Timetables
					</h3>
					<div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 lg:p-12 border border-slate-700/50 text-center">
						<div className="text-gray-400 mb-6">
							<svg
								className="w-16 h-16 mx-auto opacity-70"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
								/>
							</svg>
							<p className="mt-4 text-lg">No timetables created yet</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
};

export default MainPg;
