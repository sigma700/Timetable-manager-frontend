import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
	const userName = 'User'; // Replace with dynamic user name if available

	return (
		<main className="bg-gradient-to-b from-slate-900 to-neutral-900 min-h-screen flex justify-center items-center w-full px-4">
			<div className="flex flex-col items-center">
				<div className="flex flex-col items-center bg-white/10 rounded-xl shadow-lg p-8 max-w-md w-full">
					<img
						src="src/assets/undraw_hello_ccwj.svg"
						alt="Welcome illustration"
						className="w-40 h-40 mb-6"
					/>
					<h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
						Welcome, {userName}!
					</h1>
					<p className="text-lg text-slate-200 text-center mb-4">
						We're glad to have you here. Explore and enjoy your experience!
					</p>
				</div>
				<button className="bg-[#2a323f] text-white lg:p-[20px] font-extralight p-[10px] mt-[30px] border rounded-2xl hover:bg-[#feef4c] hover:text-black hover:transition-colors hover:duration-[0.3s] duartion-[0.3s]">
					<Link to={'/signUp'}>Get Started</Link>
				</button>
			</div>
		</main>
	);
};

export default Home;
