import React from 'react';
import { Link } from 'react-router-dom';
import {
	FaUserPlus,
	FaCheckCircle,
	FaHome,
	FaClipboardList,
	FaCog,
	FaTable,
	FaArrowRight,
	FaGraduationCap,
	FaClock,
	FaUsers,
} from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const UserManual = () => {
	const { user } = useAuthStore();
	const steps = [
		{
			number: 1,
			title: 'Account Creation & Verification',
			description:
				'Create your account and verify your email to get started with Timetable Manager',
			icon: <FaUserPlus className="text-2xl" />,
			details: [
				'Navigate to the Sign Up page',
				'Fill in your personal details',
				'Verify your email address through the link sent to your inbox',
				'Complete your profile setup',
			],
			image: 'src/assets/undraw_sign_up.svg',
			color: 'from-blue-500 to-cyan-500',
		},
		{
			number: 2,
			title: 'Select Create Timetable',
			description: 'Access the timetable creation feature from the main dashboard',
			icon: <FaHome className="text-2xl" />,
			details: [
				'Login to your account',
				"From the home page, click on 'Create Timetable'",
				'Choose between manual creation or AI-assisted generation',
				'Select your preferred template if available',
			],
			image: 'src/assets/undraw_dashboard.svg',
			color: 'from-purple-500 to-pink-500',
		},
		{
			number: 3,
			title: 'Basic School Information',
			description: 'Provide essential details about your educational institution',
			icon: <FaGraduationCap className="text-2xl" />,
			details: [
				'Enter school/university name',
				'Provide institution address and contact information',
				'Select academic level (Primary, Secondary, University)',
				'Choose the academic term or semester',
			],
			image: 'src/assets/undraw_education.svg',
			color: 'from-green-500 to-emerald-500',
		},
		{
			number: 4,
			title: 'Timetable Settings',
			description: 'Configure the fundamental structure of your timetable',
			icon: <FaCog className="text-2xl" />,
			details: [
				'Set number of working days per week',
				'Define period durations and break times',
				'Configure start and end times for each day',
				'Set up subject categories and departments',
			],
			image: 'src/assets/undraw_settings.svg',
			color: 'from-orange-500 to-red-500',
		},
		{
			number: 5,
			title: 'Finalize & Generate',
			description: 'Review and generate your complete timetable',
			icon: <FaTable className="text-2xl" />,
			details: [
				'Review all entered information',
				'Make any necessary adjustments',
				'Generate the final timetable',
				'Download or share with staff and students',
			],
			image: 'src/assets/undraw_complete.svg',
			color: 'from-indigo-500 to-purple-600',
		},
	];

	return (
		<main className="bg-gradient-to-b from-slate-900 via-slate-800 to-neutral-900 min-h-screen text-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50 sticky top-0 z-50">
				<div className="container mx-auto px-4 py-6">
					<div className="flex items-center justify-between">
						<Link
							to="/"
							className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400 hover:from-indigo-200 hover:to-purple-300 transition-all"
						>
							Protiba
						</Link>
						<nav className="flex space-x-6">
							<Link to="/login" className="text-slate-300 hover:text-white transition-colors">
								Login
							</Link>
							<Link to="/signup" className="text-slate-300 hover:text-white transition-colors">
								Sign Up
							</Link>
							<Link
								to="/manual"
								className="text-indigo-300 font-medium border-b-2 border-indigo-400"
							>
								Guide
							</Link>
						</nav>
					</div>
				</div>
			</div>

			{/* Hero Section */}
			<div className="container mx-auto px-4 py-16 text-center">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
						{user}'s Guide
					</h1>
					<p className="text-xl text-slate-300 mb-8">
						Follow these simple steps to create perfect timetables for your institution
					</p>
					<div className="flex flex-wrap justify-center gap-4 mb-12">
						<div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-full">
							<FaClock className="text-indigo-400 mr-2" />
							<span>5 Easy Steps</span>
						</div>
						<div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-full">
							<FaUsers className="text-green-400 mr-2" />
							<span>For All Institutions</span>
						</div>
						<div className="flex items-center bg-slate-800/50 px-4 py-2 rounded-full">
							<FaCheckCircle className="text-yellow-400 mr-2" />
							<span>100% Effective</span>
						</div>
					</div>
				</div>
			</div>

			{/* Steps Timeline */}
			<div className="container mx-auto px-4 py-12 max-w-6xl">
				<div className="relative">
					{/* Timeline line */}
					<div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 transform lg:-translate-x-1/2"></div>

					{/* Steps */}
					<div className="space-y-20 lg:space-y-32">
						{steps.map((step, index) => (
							<div key={step.number} className="relative">
								{/* Timeline dot */}
								<div
									className={`absolute left-3 lg:left-1/2 w-8 h-8 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center transform lg:-translate-x-1/2 -translate-y-1 z-10`}
								>
									<span className="text-white font-bold text-sm">{step.number}</span>
								</div>

								{/* Content */}
								<div
									className={`ml-16 lg:ml-0 lg:flex lg:items-center lg:justify-between ${
										index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
									}`}
								>
									{/* Text Content */}
									<div className="lg:w-5/12 mb-8 lg:mb-0">
										<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm">
											<div
												className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4`}
											>
												{step.icon}
											</div>
											<h2 className="text-2xl font-bold text-white mb-3">{step.title}</h2>
											<p className="text-slate-300 mb-4">{step.description}</p>
											<ul className="space-y-2">
												{step.details.map((detail, i) => (
													<li key={i} className="flex items-start">
														<FaArrowRight className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
														<span className="text-slate-200">{detail}</span>
													</li>
												))}
											</ul>
										</div>
									</div>

									{/* Image/Visual */}
									<div className="lg:w-6/12">
										<div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-8 border border-slate-700/30 backdrop-blur-sm">
											<div className="bg-slate-700/30 rounded-2xl p-6 text-center">
												<div className="w-24 h-24 mx-auto bg-gradient-to-r from-slate-600 to-slate-700 rounded-full flex items-center justify-center mb-4">
													<div className="text-4xl">{step.icon}</div>
												</div>
												<h3 className="text-lg font-semibold text-white mb-2">
													Step {step.number}
												</h3>
												<p className="text-slate-300">Visual demonstration available</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div className="container mx-auto px-4 py-16 text-center">
				<div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-3xl p-12 border border-slate-700/30 backdrop-blur-sm max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold text-white mb-6">Ready to Get Started?</h2>
					<p className="text-slate-300 text-lg mb-8">
						Join thousands of educational institutions already using Timetable Manager to streamline
						their scheduling process.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							to="/signup"
							className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30"
						>
							Create Your Account
						</Link>
						<Link
							to="/login"
							className="border border-slate-600 text-slate-300 px-8 py-4 rounded-xl font-semibold hover:border-slate-400 hover:text-white transition-all duration-300"
						>
							Sign In
						</Link>
					</div>
				</div>
			</div>

			{/* FAQ Section */}
			<div className="container mx-auto px-4 py-16 max-w-4xl">
				<h2 className="text-3xl font-bold text-center text-white mb-12">
					Frequently Asked Questions
				</h2>
				<div className="grid md:grid-cols-2 gap-6">
					{[
						{
							question: 'How long does it take to create a timetable?',
							answer:
								'Typically 10-15 minutes for basic setups, up to 30 minutes for complex institutions.',
						},
						{
							question: 'Can I edit the timetable after creation?',
							answer: 'Yes, you can modify any aspect of your timetable at any time.',
						},
						{
							question: 'Is there a mobile app available?',
							answer: 'Our web app is fully responsive and works perfectly on mobile devices.',
						},
						{
							question: 'What if I need help during setup?',
							answer: 'Our support team is available 24/7 to assist you with any issues.',
						},
					].map((faq, index) => (
						<div key={index} className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/30">
							<h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
							<p className="text-slate-300">{faq.answer}</p>
						</div>
					))}
				</div>
			</div>
		</main>
	);
};

export default UserManual;
