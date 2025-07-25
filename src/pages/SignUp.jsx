import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
	const [firstName, setFirstName] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [lastName, setLastName] = useState('');

	const { signUp, isLoading, error } = useAuthStore();

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await signUp(email, password, firstName, lastName);
			navigate('/verify');
		} catch (error) {}
	};
	return (
		<main className="bg-gradient-to-b from-slate-900 to-neutral-900 h-screen flex justify-center items-center w-full">
			<div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-slate-900 to-slate-700 p-[20px] rounded-2xl">
				<img src="src/assets/undraw_security_0ubl.svg" alt="" />
				<form onSubmit={handleSubmit} className="flex-col flex lg:block" action="">
					<small className="text-red-500 font-bold">{error}</small>
					<div className="flex items-center gap-[10px] p-[] lg:w-full">
						<div className="flex flex-col">
							<label className="text-white font-light" htmlFor="">
								First Name
							</label>
							<input
								type="text"
								placeholder="FirstName"
								className="bg-gray-100 text-black lg:p-[10px] p-[5px] lg:rounded-2xl lg:w-[180px] w-[130px]"
								onChange={(e) => setFirstName(e.target.value)}
								value={firstName}
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
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
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
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<label htmlFor="" className="text-white font-light">
						Password
					</label>
					<input
						className="bg-gray-100 text-black p-[10px] lg:rounded-2xl lg:w-full"
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<div className="flex items-center gap-[10px] mt-[10px]">
						<input type="checkbox" />
						<small className="text-white font-light">I agree to the terms and conditions</small>
					</div>

					<button
						type="submit"
						className="text-white bg-gradient-to-r from-slate-500 to-slate-800 p-[10px] w-full mt-[20px] hover:cursor-pointer hover:border hover:transition-all duration-[0.4s] hover:duration-[0.4s]"
					>
						Create Account
					</button>
					{isLoading && (
						<div className="flex items-center justify-center my-4">
							<svg
								className="animate-spin h-5 w-5 text-slate-400 mr-2"
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
									d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
								></path>
							</svg>
							<span className="text-slate-300">Signing up...</span>
						</div>
					)}
				</form>
			</div>
		</main>
	);
};

export default SignUp;
