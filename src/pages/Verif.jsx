import React, { useState } from 'react';
import Otp from './components/otp';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Verif = () => {
	const [code, setCode] = useState('');
	const { verify, isLoading, error, user } = useAuthStore();

	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await verify(code);
			navigate('/create');
		} catch (error) {
			// Handle error
		}
	};

	const handleOtpChange = (newCode) => {
		setCode(newCode);
	};

	return (
		<main className="bg-gradient-to-b from-slate-900 to-neutral-900 h-screen flex justify-center items-center w-full">
			<div className="text-white bg-gradient-to-b from-slate-700 to-gray-900 p-[10px] lg:p-[130px] rounded-2xl flex flex-col items-center">
				<h1 className="mb-[30px] font-bold bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent lg:text-[30px]">
					Enter the 6-Digit code sent to your email
				</h1>
				<form className="" onSubmit={handleSubmit}>
					<div className="flex flex-col w-full items-center justify-center gap-4">
						<div className="flex-1 min-w-0">
							{' '}
							{/* Container for OTP with flexible width */}
							<Otp value={code} onChange={handleOtpChange} />
						</div>

						<div className="flex flex-col items-center gap-2">
							{' '}
							{/* Container for error and button */}
							{error && <p className="text-red-500 text-sm whitespace-nowrap">{error}</p>}
							<button
								type="submit"
								disabled={isLoading}
								className="bg-[#2a323f] lg:p-[20px] p-[20px] font-extralight hover:bg-[] rounded-2xl hover:bg-[#feef4c] hover:text-black hover:transition-colors hover:duration-[0.3s] duartion-[0.3s] hover:cursor-pointer"
							>
								{isLoading ? 'Verifying...' : 'Verify Code'}
							</button>
						</div>
					</div>
				</form>
				<div className="mt-8 text-center">
					<h3 className="font-light">Didn't get the code?</h3>
					<button
						className="bg-[#2a323f] lg:p-[20px] p-[20px] font-extralight hover:bg-[] rounded-2xl mt-[30px] hover:bg-[#feef4c] hover:text-black hover:transition-colors hover:duration-[0.3s] duartion-[0.3s] hover:cursor-pointer"
						type="button"
					>
						Resend Code
					</button>
				</div>
			</div>
		</main>
	);
};

export default Verif;
