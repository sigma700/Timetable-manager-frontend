import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Contacts = () => {
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
						Get in Touch With Us
					</h1>
					<p className="text-xl text-slate-300 max-w-3xl mx-auto">
						Have questions or want to learn more about our services? Reach out to our team and we'll
						be happy to assist you.
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
							<h2 className="text-2xl font-bold mb-6 text-white">Contact Information</h2>

							{/* Location Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="flex items-start p-6 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/30 hover:border-indigo-400/50 transition-all"
							>
								<div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 mt-1">
									<FaMapMarkerAlt className="text-white text-lg" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-300">Our Location</h3>
									<p className="text-white">
										KImathi Street Nyeri
										<br />
										Boma Nyeri
									</p>
								</div>
							</motion.div>

							{/* Phone Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="flex items-start p-6 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/30 hover:border-purple-400/50 transition-all"
							>
								<div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4 mt-1">
									<FaPhone className="text-white text-lg" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-300">Phone Number</h3>
									<p className="text-white">(+254) 792624342</p>
								</div>
							</motion.div>

							{/* Email Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="flex items-start p-6 bg-slate-700/50 rounded-2xl mb-4 border border-slate-600/30 hover:border-blue-400/50 transition-all"
							>
								<div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mr-4 mt-1">
									<FaEnvelope className="text-white text-lg" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-300">Email Address</h3>
									<p className="text-white">allankirimi65@gmail.com</p>
								</div>
							</motion.div>

							{/* Hours Card */}
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="flex items-start p-6 bg-slate-700/50 rounded-2xl border border-slate-600/30 hover:border-green-400/50 transition-all"
							>
								<div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4 mt-1">
									<FaClock className="text-white text-lg" />
								</div>
								<div>
									<h3 className="font-semibold text-slate-300">Working Hours</h3>
									<p className="text-white">
										Monday - Friday: 9AM - 6PM
										<br />
										Saturday: 10AM - 4PM
									</p>
								</div>
							</motion.div>

							{/* Social Links */}
							<div className="flex space-x-4 pt-6">
								<motion.a
									whileHover={{ scale: 1.1, y: -5 }}
									href="#"
									className="bg-slate-700/50 p-3 rounded-full text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
								>
									<FaFacebookF />
								</motion.a>
								<motion.a
									whileHover={{ scale: 1.1, y: -5 }}
									href="#"
									className="bg-slate-700/50 p-3 rounded-full text-slate-300 hover:bg-blue-400 hover:text-white transition-colors"
								>
									<FaTwitter />
								</motion.a>
								<motion.a
									whileHover={{ scale: 1.1, y: -5 }}
									href="#"
									className="bg-slate-700/50 p-3 rounded-full text-slate-300 hover:bg-pink-600 hover:text-white transition-colors"
								>
									<FaInstagram />
								</motion.a>
								<motion.a
									whileHover={{ scale: 1.1, y: -5 }}
									href="www.linkedin.com/in/allan-kirimi-31ba92323"
									className="bg-slate-700/50 p-3 rounded-full text-slate-300 hover:bg-blue-700 hover:text-white transition-colors"
								>
									<FaLinkedinIn />
								</motion.a>
							</div>
						</div>
					</motion.div>

					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm"
					>
						<h2 className="text-2xl font-bold mb-6 text-white">Send Us a Message</h2>
						<form className="space-y-6">
							<div>
								<label className="block text-slate-300 mb-2">Full Name</label>
								<input
									type="text"
									className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
									placeholder="Enter your name"
								/>
							</div>

							<div>
								<label className="block text-slate-300 mb-2">Email Address</label>
								<input
									type="email"
									className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
									placeholder="Enter your email"
								/>
							</div>

							<div>
								<label className="block text-slate-300 mb-2">Subject</label>
								<input
									type="text"
									className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
									placeholder="What is this regarding?"
								/>
							</div>

							<div>
								<label className="block text-slate-300 mb-2">Your Message</label>
								<textarea
									rows="5"
									className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
									placeholder="Type your message here..."
								></textarea>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								type="submit"
								className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
							>
								Send Message
							</motion.button>
						</form>
					</motion.div>
				</div>

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="grid md:grid-cols-4 gap-6 mt-16"
				>
					{[
						{ number: '24/7', label: 'Support Available' },
						{ number: '1h', label: 'Avg. Response Time' },
						{ number: '100%', label: 'Satisfaction Rate' },
						{ number: '500+', label: 'Clients Served' },
					].map((stat, index) => (
						<motion.div
							key={index}
							whileHover={{ scale: 1.05, y: -5 }}
							className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-6 text-center border border-slate-700/30"
						>
							<div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
								{stat.number}
							</div>
							<div className="text-slate-300 mt-2">{stat.label}</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</div>
	);
};

export default Contacts;
