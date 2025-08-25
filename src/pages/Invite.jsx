import React, { useState } from 'react';
import {
	FaUserFriends,
	FaGift,
	FaCopy,
	FaCheck,
	FaShare,
	FaEnvelope,
	FaWhatsapp,
	FaLink,
	FaUsers,
	FaStar,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const Invite = () => {
	const [emails, setEmails] = useState(['']);
	const [copied, setCopied] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const referralCode = 'TIMETABLE-FRIEND25';

	const addEmailField = () => {
		setEmails([...emails, '']);
	};

	const removeEmailField = (index) => {
		if (emails.length > 1) {
			setEmails(emails.filter((_, i) => i !== index));
		}
	};

	const updateEmail = (index, value) => {
		const newEmails = [...emails];
		newEmails[index] = value;
		setEmails(newEmails);
	};

	const copyReferralLink = () => {
		const link = `https://timetablemanager.com/invite?ref=${referralCode}`;
		navigator.clipboard.writeText(link);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the invites
		setIsSubmitted(true);
	};

	const shareOptions = [
		{
			icon: FaEnvelope,
			label: 'Email',
			color: 'from-red-500 to-pink-500',
			action: () =>
				window.open(
					`mailto:?subject=Join me on Timetable Manager&body=Check out this amazing timetable management app! Use my referral code: ${referralCode}`
				),
		},
		{
			icon: FaWhatsapp,
			label: 'WhatsApp',
			color: 'from-green-500 to-emerald-500',
			action: () =>
				window.open(
					`https://wa.me/?text=Join me on Timetable Manager! Use my referral code: ${referralCode}`
				),
		},
		{
			icon: FaLink,
			label: 'Copy Link',
			color: 'from-blue-500 to-cyan-500',
			action: copyReferralLink,
		},
	];

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
					<div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
						<FaUserFriends className="text-white text-3xl" />
					</div>
					<h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
						Invite Friends & Colleagues
					</h1>
					<p className="text-xl text-slate-300 max-w-3xl mx-auto">
						Share the power of Protiba with your network and earn exclusive rewards for every friend
						who joins!
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-12 items-start">
					{/* Rewards & Benefits */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="space-y-8"
					>
						{/* Referral Code */}
						<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold mb-6 text-white">Your Referral Code</h2>
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="relative group cursor-pointer"
								onClick={copyReferralLink}
							>
								<div className="bg-slate-700/50 rounded-2xl p-6 border-2 border-dashed border-slate-600/50 group-hover:border-indigo-400/50 transition-all">
									<div className="text-center">
										<div className="text-2xl font-mono font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 mb-2">
											{referralCode}
										</div>
										<div className="text-slate-400 text-sm">
											{copied ? 'Copied to clipboard!' : 'Click to copy referral link'}
										</div>
									</div>
								</div>
								<div className="absolute top-4 right-4">
									{copied ? (
										<FaCheck className="text-green-400 text-xl" />
									) : (
										<FaCopy className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
									)}
								</div>
							</motion.div>
						</div>

						{/* Rewards Program */}
						<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm">
							<h2 className="text-2xl font-bold mb-6 text-white">Earn Amazing Rewards</h2>
							<div className="space-y-4">
								{[
									{
										icon: FaGift,
										reward: '1 Month Free Premium',
										requirement: '3 successful referrals',
										color: 'from-yellow-500 to-orange-500',
									},
									{
										icon: FaUsers,
										reward: 'Priority Support',
										requirement: '5 successful referrals',
										color: 'from-blue-500 to-cyan-500',
									},
									{
										icon: FaStar,
										reward: 'Custom Features',
										requirement: '10+ successful referrals',
										color: 'from-purple-500 to-pink-500',
									},
								].map((item, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: index * 0.1 }}
										className="flex items-center p-4 bg-slate-700/30 rounded-xl border border-slate-600/30"
									>
										<div
											className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-full flex items-center justify-center mr-4`}
										>
											<item.icon className="text-white text-lg" />
										</div>
										<div className="flex-1">
											<div className="font-semibold text-white">{item.reward}</div>
											<div className="text-slate-400 text-sm">{item.requirement}</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>

					{/* Invite Form */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm"
					>
						{isSubmitted ? (
							<div className="text-center py-12">
								<div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
									<FaCheck className="text-white text-3xl" />
								</div>
								<h2 className="text-2xl font-bold text-white mb-4">Invites Sent Successfully!</h2>
								<p className="text-slate-300 mb-6">
									Your invitations have been sent. You'll earn rewards once your friends sign up.
								</p>
								<button
									onClick={() => setIsSubmitted(false)}
									className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all"
								>
									Send More Invites
								</button>
							</div>
						) : (
							<>
								<h2 className="text-2xl font-bold mb-6 text-white">Send Invitations</h2>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div>
										<label className="block text-slate-300 mb-3">Email Addresses</label>
										<div className="space-y-3">
											{emails.map((email, index) => (
												<div key={index} className="flex items-center space-x-3">
													<input
														type="email"
														value={email}
														onChange={(e) => updateEmail(index, e.target.value)}
														className="flex-1 bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
														placeholder="friend@example.com"
													/>
													{emails.length > 1 && (
														<button
															type="button"
															onClick={() => removeEmailField(index)}
															className="w-10 h-10 bg-red-500/20 text-red-400 rounded-xl flex items-center justify-center hover:bg-red-500/30 transition-all"
														>
															×
														</button>
													)}
												</div>
											))}
										</div>
										<button
											type="button"
											onClick={addEmailField}
											className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm flex items-center"
										>
											+ Add another email
										</button>
									</div>

									<div>
										<label className="block text-slate-300 mb-2">Personal Message (Optional)</label>
										<textarea
											rows={3}
											className="w-full bg-slate-700/50 border border-slate-600/30 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
											placeholder="Add a personal note to your invitation..."
										/>
									</div>

									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										type="submit"
										className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center group"
									>
										<FaShare className="mr-2" />
										Send Invitations
									</motion.button>
								</form>

								{/* Quick Share Options */}
								<div className="mt-8">
									<h3 className="text-lg font-semibold text-slate-300 mb-4 text-center">
										Or share quickly via
									</h3>
									<div className="grid grid-cols-3 gap-3">
										{shareOptions.map((option, index) => (
											<motion.button
												key={index}
												whileHover={{ scale: 1.05 }}
												whileTap={{ scale: 0.95 }}
												onClick={option.action}
												className={`bg-gradient-to-r ${option.color} text-white p-3 rounded-xl flex flex-col items-center justify-center space-y-2 transition-all`}
											>
												<option.icon className="text-xl" />
												<span className="text-sm font-medium">{option.label}</span>
											</motion.button>
										))}
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
						{ number: '2,500+', label: 'Successful Invites' },
						{ number: '85%', label: 'Acceptance Rate' },
						{ number: '1,200+', label: 'Active Referrers' },
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

export default Invite;
