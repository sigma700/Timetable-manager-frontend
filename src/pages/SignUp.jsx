import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

const SignUp = () => {
	const [firstName, setFirstName] = useState('');
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const [lastName, setLastName] = useState('');
	const [agreeToTerms, setAgreeToTerms] = useState(false);

	const { signUp, isLoading, error } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!agreeToTerms) {
			alert('Please agree to the terms and conditions');
			return;
		}
		try {
			await signUp(email, password, firstName, lastName);
			navigate('/verify');
		} catch (error) {}
	};

	return (
		<main className="bg-gradient-to-b from-slate-900 via-slate-800 to-neutral-900 min-h-screen flex justify-center items-center w-full p-4 lg:p-8">
			<div className="flex flex-col lg:flex-row items-center bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 p-6 lg:p-8 rounded-3xl shadow-2xl border border-slate-700/30 backdrop-blur-sm max-w-4xl w-full">
				{/* Illustration Side */}
				<div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center">
					<div className="text-center">
						<img
							src="src/assets/undraw_security_0ubl.svg"
							alt="Security illustration"
							className="w-56 lg:w-72 mx-auto mb-6"
						/>
						<h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">Join Us Today</h1>
						<p className="text-slate-300 text-sm lg:text-base max-w-md">
							Create your account and start managing your schedules with ease and security.
						</p>
					</div>
				</div>

				{/* Form Side */}
				<div className="lg:w-1/2 w-full">
					<form onSubmit={handleSubmit} className="space-y-5">
						{error && (
							<div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3">
								<small className="text-red-300 font-medium">{error}</small>
							</div>
						)}

						{/* Name Fields */}
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
							<div className="space-y-2">
								<label className="text-white font-light text-sm" htmlFor="firstName">
									First Name
								</label>
								<input
									id="firstName"
									type="text"
									placeholder="First Name"
									className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
									onChange={(e) => setFirstName(e.target.value)}
									value={firstName}
									required
								/>
							</div>
							<div className="space-y-2">
								<label className="text-white font-light text-sm" htmlFor="lastName">
									Last Name
								</label>
								<input
									id="lastName"
									type="text"
									placeholder="Last Name"
									className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
								/>
							</div>
						</div>

						{/* Email Field */}
						<div className="space-y-2">
							<label className="text-white font-light text-sm" htmlFor="email">
								Email Address
							</label>
							<input
								id="email"
								className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>

						{/* Password Field */}
						<div className="space-y-2">
							<label className="text-white font-light text-sm" htmlFor="password">
								Password
							</label>
							<input
								id="password"
								className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
								type="password"
								placeholder="Create a password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>

						{/* Terms Checkbox */}
						<div className="flex items-start space-x-3">
							<input
								type="checkbox"
								id="terms"
								checked={agreeToTerms}
								onChange={(e) => setAgreeToTerms(e.target.checked)}
								className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500 mt-1"
							/>
							<label htmlFor="terms" className="text-slate-300 text-sm cursor-pointer">
								I agree to the{' '}
								<Link to="/terms" className="text-slate-100 hover:text-white underline">
									terms and conditions
								</Link>
							</label>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-slate-600 to-slate-800 text-white p-3 rounded-xl font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-700/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
						>
							{isLoading ? 'Creating Account...' : 'Create Account'}
						</button>

						{/* Loading Indicator */}
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
								<span className="text-slate-300">Creating your account...</span>
							</div>
						)}

						{/* Already have an account section */}
						<div className="text-center pt-4 border-t border-slate-600/50 mt-6">
							<p className="text-slate-300 text-sm">
								Already have an account?{' '}
								<Link
									to="/login"
									className="text-slate-100 hover:text-white font-medium underline transition-colors"
								>
									Login instead
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</main>
	);
};

export default SignUp;
