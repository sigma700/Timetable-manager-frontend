import React from 'react';

const Home = () => {
	return (
		<main className="bg-gradient-to-b from-slate-900 to-neutral-900 h-screen flex justify-center items-center w-full">
			<div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-slate-900 to-slate-700 p-[20px] rounded-2xl">
				<img src="src/assets/undraw_security_0ubl.svg" alt="" />
				<form className="flex-col flex lg:block" action="">
					<div className="flex items-center gap-[10px] p-[] lg:w-full">
						<div className="flex flex-col">
							<label className="text-white font-light" htmlFor="">
								First Name
							</label>
							<input
								type="text"
								placeholder="FirstName"
								className="bg-gray-100 text-black lg:p-[10px] p-[5px] lg:rounded-2xl lg:w-[180px] w-[130px]"
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-white font-light" htmlFor="">
								Last Name
							</label>
							<input
								type="text"
								placeholder="Last Name"
								className="bg-gray-100 text-black lg:p-[10px] lg:rounded-2xl lg:w-[180px] p-[5px] w-[130px]"
							/>
						</div>
					</div>
					<label htmlFor="" className="text-white font-light">
						Email
					</label>
					<input
						className="bg-gray-100 text-black p-[10px] lg:rounded-2xl lg:w-full"
						type="email"
						placeholder="Email"
					/>
					<label htmlFor="" className="text-white font-light">
						Password
					</label>
					<input
						className="bg-gray-100 text-black p-[10px] lg:rounded-2xl lg:w-full"
						type="password"
						placeholder="Password"
					/>
					<div className="flex items-center gap-[10px] mt-[10px]">
						<input type="checkbox" />
						<small className="text-white font-light">I agree to the terms and conditions</small>
					</div>
					<button
						type="submit"
						className="text-white bg-gradient-to-r from-slate-500 to-slate-800 p-[10px] w-full mt-[20px] hover:cursor-pointer hover:border hover:transition-all duration-[0.4s] hover:duration-[0.4s]"
					>
						Create account
					</button>
				</form>
			</div>
		</main>
	);
};

export default Home;
