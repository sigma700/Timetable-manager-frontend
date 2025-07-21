import React from 'react';
import { FullMenu } from './components/animatedHamb';
import { useAuthStore } from '../store/authStore';
import HoverDevCards from './components/gridOPtions';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const MainPg = () => {
	const { checkAuth, user } = useAuthStore();

	return (
		<main className="text-white relative h-full bg-gradient-to-r from-slate-900 to-slate-900 overflow-auto">
			<FullMenu />
			{/* Main content area */}
			<div className="h-full w-full flex flex-col absolute top-1/9 items-center z-0 p-[5px]">
				<h1 className="text-gray-200 font-extrabold text-[30px] lg:text-[40px]">
					Welcome {user} !
				</h1>
				<div className="sytled-container lg:my-[30px]">
					<h2 className="text-[22px] lg:text-[25px]">Select Action</h2>
					<div className="w-full h-1 bg-white my-1 rounded"></div>
				</div>
				<div className="">
					<HoverDevCards />
				</div>
				<h3 className=" my-[30px] lg:my-[70px]">Your timetables</h3>
				<div className="create-table flex flex-col justify-center items-center bg-amber-50 text-black p-[50px] lg:p-[100px] w-full rounded-[20px]">
					<h4>None Yet</h4>
					<button className="p-[20px] bg-gradient-to-r from-indigo-700 to-indigo-700 lg:p-[30px] lg:w-[300px] rounded-[20px] text-white font-extrabold flex items-center justify-center gap-[20px] hover:opacity-[0.8] hover:scale-[1.009] hover:text-gray-100 hover:transition-all hover:duration-[0.3s] hover:cursor-pointer">
						<Link>Create New</Link>
						<FaPlus />
					</button>
				</div>
			</div>
		</main>
	);
};

export default MainPg;
