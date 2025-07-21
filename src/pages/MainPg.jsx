import React from 'react';
import { FullMenu } from './components/animatedHamb';
import { useAuthStore } from '../store/authStore';
import HoverDevCards from './components/gridOPtions';

const MainPg = () => {
	const { checkAuth, user } = useAuthStore();

	return (
		<main className="text-white relative h-screen bg-gradient-to-r from-slate-900 to-slate-900 overflow-hidden">
			<FullMenu />
			{/* Main content area */}
			<div className="h-full w-full flex flex-col absolute top-1/9 items-center z-0">
				<h1 className="text-gray-200 font-extrabold text-[30px] lg:text-[40px]">
					Welcome {user} !
				</h1>
				<div className="sytled-container my-[40px]">
					<h2 className="text-[22px] lg:text-[25px]">Select Action</h2>
					<div className="w-full h-1 bg-white my-1 rounded"></div>
				</div>
				<div className="grid">
					<HoverDevCards />
				</div>
			</div>
		</main>
	);
};

export default MainPg;
