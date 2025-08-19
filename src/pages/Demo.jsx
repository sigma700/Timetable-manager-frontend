import React, { useState } from 'react';
import {
	FaCalendarAlt,
	FaClock,
	FaPhone,
	FaEnvelope,
	FaVideo,
	FaCheckCircle,
	FaArrowRight,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const Demo = () => {
	const { user } = useAuthStore();
	const [selectedDate, setSelectedDate] = useState('');
	const [selectedTime, setSelectedTime] = useState('');
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [institution, setInstitution] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);

	const timeSlots = [
		'09:00 AM',
		'10:00 AM',
		'11:00 AM',
		'12:00 PM',
		'02:00 PM',
		'03:00 PM',
		'04:00 PM',
		'05:00 PM',
	];

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the data to your backend
		setIsSubmitted(true);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900 text-white py-16 px-4">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-center mb-16"
				>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
						Hey {user} Schedule a Demo
					</h1>
					<p className="text-xl text-slate-300 max-w-3xl mx-auto">
						Experience the power of Protiba firsthand. Book a personalized demo and see how we can
						transform your scheduling process.
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-12 items-start">
					{/* Contact Information */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-8"
					>
						{/* Contact Cards */}
						<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold mb-6 text-white">Get in Touch</h2>

							{/* Phone Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="flex items-center p-6 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/30 hover:border-indigo-400/50 transition-all"
							>
								<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
									<FaPhone className="text-white text-lg" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-300">Call Us</h3>
									<a
										href="tel:+254792624342"
										className="text-white text-lg font-bold hover:text-indigo-300 transition-colors"
									>
										(+254) 792 624 342
									</a>
								</div>
							</motion.div>

							{/* Email Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="flex items-center p-6 bg-slate-700/50 rounded-2xl border border-slate-600/30 hover:border-purple-400/50 transition-all"
							>
								<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
									<FaEnvelope className="text-white text-lg" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-300">Email Us</h3>
									<a
										href="mailto:allankirimi65@gmail.com"
										className="text-white text-lg font-bold hover:text-purple-300 transition-colors break-all"
									>
										allankirimi65@gmail.com
									</a>
								</div>
							</motion.div>
						</div>

						{/* Benefits */}
						<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold mb-6 text-white">Why Schedule a Demo?</h2>
							<div className="space-y-4">
								{[
									'Live product walkthrough',
									'Personalized solution for your institution',
									'Q&A with our experts',
									'See advanced features in action',
									'Get pricing and implementation details',
								].map((benefit, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="flex items-center"
									>
										<FaCheckCircle className="text-green-400 mr-3 flex-shrink-0" />
										<span className="text-slate-300">{benefit}</span>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>

					{/* Booking Form */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm"
					>
						{isSubmitted ? (
							<div className="text-center py-12">
								<div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
									<FaCheckCircle className="text-white text-3xl" />
								</div>
								<h2 className="text-2xl font-bold text-white mb-4">Demo Scheduled Successfully!</h2>
								<p className="text-slate-300 mb-6">
									Thank you for scheduling a demo. We've sent a confirmation email with the meeting
									details.
								</p>
								<button
									onClick={() => setIsSubmitted(false)}
									className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
								>
									Schedule Another Demo
								</button>
							</div>
						) : (
							<>
								<h2 className="text-2xl font-bold mb-6 text-white">Book Your Demo</h2>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<label className="block text-slate-300 mb-2">Full Name</label>
										<input
											type="text"
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
											placeholder="Enter your full name"
										/>
									</div>

									<div>
										<label className="block text-slate-300 mb-2">Email Address</label>
										<input
											type="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
											placeholder="Enter your email"
										/>
									</div>

									<div>
										<label className="block text-slate-300 mb-2">Institution Name</label>
										<input
											type="text"
											required
											value={institution}
											onChange={(e) => setInstitution(e.target.value)}
											className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
											placeholder="Your school or organization"
										/>
									</div>

									<div className="grid md:grid-cols-2 gap-4">
										<div>
											<label className="block text-slate-300 mb-2">Preferred Date</label>
											<div className="relative">
												<FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
												<input
													type="date"
													required
													value={selectedDate}
													onChange={(e) => setSelectedDate(e.target.value)}
													className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl pl-12 pr-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
												/>
											</div>
										</div>

										<div>
											<label className="block text-slate-300 mb-2">Preferred Time</label>
											<div className="relative">
												<FaClock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
												<select
													required
													value={selectedTime}
													onChange={(e) => setSelectedTime(e.target.value)}
													className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none"
												>
													<option value="">Select time</option>
													{timeSlots.map((time) => (
														<option key={time} value={time}>
															{time}
														</option>
													))}
												</select>
											</div>
										</div>
									</div>

									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
									>
										Schedule Demo Now
										<FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
									</motion.button>
								</form>

								<div className="mt-6 p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
									<div className="flex items-center">
										<FaVideo className="text-indigo-400 mr-3" />
										<span className="text-slate-300 text-sm">
											Demo will be conducted via Google Meet. Meeting link will be sent after
											booking.
										</span>
									</div>
								</div>
							</>
						)}
					</motion.div>
				</div>

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="grid md:grid-cols-3 gap-6 mt-16"
				>
					{[
						{ number: '500+', label: 'Demos Conducted' },
						{ number: '98%', label: 'Satisfaction Rate' },
						{ number: '24h', label: 'Response Time' },
					].map((stat, index) => (
						<div
							key={index}
							className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 text-center border border-slate-700/30"
						>
							<div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
								{stat.number}
							</div>
							<div className="text-slate-300 mt-2">{stat.label}</div>
						</div>
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default Demo;
