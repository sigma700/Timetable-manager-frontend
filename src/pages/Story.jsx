import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Story = () => {
	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delay: 0.3,
				duration: 0.8,
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
	};

	const cardVariants = {
		hidden: { scale: 0.9, opacity: 0 },
		visible: {
			scale: 1,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
		hover: {
			y: -10,
			transition: {
				duration: 0.3,
			},
		},
	};

	// Get current month and year
	const currentDate = new Date();
	const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
	const currentYear = currentDate.getFullYear();

	// Month-based timeline starting from June
	const timelineData = [
		{
			month: 'June',
			year: 2024,
			title: 'The Spark of an Idea',
			description:
				'After witnessing the struggles of school administrators during timetable creation season, the concept for Protiba was born. I began researching the complexities of educational scheduling.',
		},
		{
			month: 'July',
			year: 2024,
			title: 'Algorithm Development',
			description:
				"I dedicated this month to designing the core scheduling algorithm that would become Protiba's foundation. Countless hours were spent perfecting the conflict resolution system.",
		},
		{
			month: 'August',
			year: 2024,
			title: 'UI/UX Design & Prototyping',
			description:
				'Created the first interactive prototypes, focusing on making complex scheduling intuitive and accessible for educators of all technical abilities.',
		},
		{
			month: 'September',
			year: 2024,
			title: 'Frontend Development',
			description:
				'Began building the React application with a focus on performance and user experience. Implemented the dashboard and timetable visualization components.',
		},
		{
			month: 'October',
			year: 2024,
			title: 'Backend Integration',
			description:
				'Developed the API and database architecture to handle complex scheduling operations. Implemented user authentication and data persistence.',
		},
		{
			month: 'November',
			year: 2024,
			title: 'Testing & Feedback',
			description:
				'Conducted extensive testing with sample data from real schools. Gathered feedback from educators and made crucial improvements to the algorithm.',
		},
		{
			month: currentMonth,
			year: currentYear,
			title: 'Launch Preparation',
			description:
				'Final polishing, performance optimization, and deployment preparation. Getting ready to share Protiba with the world!',
		},
	];

	return (
		<main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900 text-white">
			{/* Navigation */}
			<nav className="container mx-auto px-4 py-6">
				<Link
					to="/"
					className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent"
				>
					Protiba
				</Link>
			</nav>

			{/* Hero Section */}
			<section className="container mx-auto px-4 py-16">
				<motion.div
					className="text-center max-w-3xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					animate="visible"
				>
					<motion.h1 className="text-4xl md:text-5xl font-bold mb-6" variants={itemVariants}>
						Our <span className="text-amber-400">Story</span>
					</motion.h1>
					<motion.p className="text-xl text-slate-300 mb-8" variants={itemVariants}>
						How a simple idea transformed into a revolutionary timetable management solution
					</motion.p>
				</motion.div>
			</section>

			{/* The Problem Section */}
			<section className="container mx-auto px-4 py-16">
				<motion.div
					className="grid md:grid-cols-2 gap-12 items-center"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.div variants={itemVariants}>
						<h2 className="text-3xl font-bold mb-6">
							The <span className="text-amber-400">Problem</span> We Solved
						</h2>
						<p className="text-slate-300 mb-4">
							Creating school timetables has traditionally been a tedious, time-consuming process
							that takes educators away from what they do best—teaching.
						</p>
						<ul className="space-y-3 mb-6">
							<li className="flex items-start">
								<span className="text-amber-400 mr-2">•</span>
								<span>Manual timetable creation can take weeks of valuable time</span>
							</li>
							<li className="flex items-start">
								<span className="text-amber-400 mr-2">•</span>
								<span>Scheduling conflicts lead to frustration for teachers and students</span>
							</li>
							<li className="flex items-start">
								<span className="text-amber-400 mr-2">•</span>
								<span>Last-minute changes create chaos in school operations</span>
							</li>
							<li className="flex items-start">
								<span className="text-amber-400 mr-2">•</span>
								<span>Limited resources aren't optimized effectively</span>
							</li>
						</ul>
					</motion.div>
					<motion.div
						className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/30"
						variants={itemVariants}
						whileHover={{ scale: 1.02 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<img
							src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
							alt="Frustrated teacher with paperwork"
							className="rounded-xl w-full h-64 object-cover"
						/>
					</motion.div>
				</motion.div>
			</section>

			{/* The Solution Section */}
			<section className="container mx-auto px-4 py-16 bg-slate-800/20 rounded-3xl my-16">
				<motion.div
					className="text-center max-w-3xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.h2 className="text-3xl font-bold mb-6" variants={itemVariants}>
						The <span className="text-amber-400">Protiba</span> Solution
					</motion.h2>
					<motion.p className="text-xl text-slate-300 mb-12" variants={itemVariants}>
						We built an intelligent system that automates timetable creation, eliminates conflicts,
						and saves educators countless hours each semester.
					</motion.p>

					<div className="grid md:grid-cols-3 gap-8">
						{[
							{
								title: 'Automated Scheduling',
								description: 'Our algorithm creates optimal timetables in minutes instead of weeks',
								icon: '⏱️',
							},
							{
								title: 'Conflict Resolution',
								description: 'Automatically detects and resolves scheduling conflicts',
								icon: '✅',
							},
							{
								title: 'Resource Optimization',
								description: 'Maximizes utilization of classrooms, teachers, and facilities',
								icon: '📊',
							},
						].map((feature, index) => (
							<motion.div
								key={index}
								className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30"
								variants={cardVariants}
								whileHover="hover"
							>
								<div className="text-4xl mb-4">{feature.icon}</div>
								<h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
								<p className="text-slate-300">{feature.description}</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>

			{/* The Journey Section */}
			<section className="container mx-auto px-4 py-16">
				<motion.div
					className="max-w-4xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.h2 className="text-3xl font-bold mb-6 text-center" variants={itemVariants}>
						Our <span className="text-amber-400">Journey</span>
					</motion.h2>

					<div className="relative">
						{/* Timeline line */}
						<div className="absolute left-4 md:left-1/2 top-0 h-full w-1 bg-amber-500/30 transform -translate-x-1/2"></div>

						{/* Timeline items */}
						{timelineData.map((milestone, index) => (
							<motion.div
								key={index}
								className={`flex flex-col md:flex-row mb-12 ${
									index % 2 === 0 ? 'md:flex-row-reverse' : ''
								}`}
								variants={itemVariants}
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: '-100px' }}
							>
								<div className="md:w-1/2 mb-4 md:mb-0 md:px-8 flex md:justify-center">
									<div className="flex items-center">
										<div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-slate-900 font-bold z-10">
											{index + 1}
										</div>
										<div className="ml-4">
											<div className="text-amber-400 font-semibold">
												{milestone.month} {milestone.year}
											</div>
											<h3 className="text-xl font-semibold">{milestone.title}</h3>
										</div>
									</div>
								</div>
								<div className="md:w-1/2 md:px-8">
									<div className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30">
										<p className="text-slate-300">{milestone.description}</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>

			{/* Credits Section */}
			<section className="container mx-auto px-4 py-16">
				<motion.div
					className="text-center max-w-3xl mx-auto"
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
				>
					<motion.h2 className="text-3xl font-bold mb-6" variants={itemVariants}>
						With <span className="text-amber-400">Gratitude</span>
					</motion.h2>
					<motion.p className="text-xl text-slate-300 mb-12" variants={itemVariants}>
						Protiba wouldn't exist without the support and contributions of these amazing people.
					</motion.p>

					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								name: 'Robert Kirimi',
								role: 'Emotional Support & Inspiration',
								description:
									'My father, whose unwavering belief in me and constant encouragement made this journey possible. His support kept me motivated through challenging development phases.',
								avatar: '👨‍👦',
							},
							{
								name: 'Zeno Rocha',
								role: 'Technical Inspiration',
								description:
									"One of the Resend developers whose work and dedication to developer experience inspired many aspects of Protiba's architecture and user interface.",
								avatar: '👨‍💻',
							},
						].map((person, index) => (
							<motion.div
								key={index}
								className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30 text-center"
								variants={cardVariants}
								whileHover="hover"
							>
								<div className="text-5xl mb-4">{person.avatar}</div>
								<h3 className="text-xl font-semibold mb-1">{person.name}</h3>
								<p className="text-amber-400 mb-4">{person.role}</p>
								<p className="text-slate-300">{person.description}</p>
							</motion.div>
						))}

						{/* Special thanks to users */}
						<motion.div
							className="bg-slate-800/40 rounded-2xl p-6 border border-slate-700/30 text-center md:col-span-2 lg:col-span-1"
							variants={cardVariants}
							whileHover="hover"
						>
							<div className="text-5xl mb-4">🙏</div>
							<h3 className="text-xl font-semibold mb-1">Our Early Testers</h3>
							<p className="text-amber-400 mb-4">The Real Heroes</p>
							<p className="text-slate-300">
								To all the educators and administrators who believed in Protiba early on and
								provided valuable feedback to make it better.
							</p>
						</motion.div>
					</div>
				</motion.div>
			</section>

			{/* Call to Action */}
			<section className="container mx-auto px-4 py-16 text-center">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7 }}
					viewport={{ once: true }}
				>
					<h2 className="text-3xl font-bold mb-6">Ready to transform your school's scheduling?</h2>
					<p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
						Join the growing community of educators who are saving time and reducing stress with
						Protiba.
					</p>
					<Link
						to="/signup"
						className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium py-3 px-8 rounded-2xl inline-flex items-center justify-center transition-all hover:shadow-lg hover:shadow-amber-500/20"
					>
						Get Started Today
					</Link>
				</motion.div>
			</section>

			{/* Footer */}
			<footer className="container mx-auto px-4 py-8 border-t border-slate-700/30 mt-16">
				<div className="flex flex-col md:flex-row justify-between items-center">
					<div className="text-slate-400 mb-4 md:mb-0">
						© {new Date().getFullYear()} Protiba. All rights reserved.
					</div>
					<Link to="/" className="text-amber-400 hover:text-amber-300 transition-colors">
						Back to Home
					</Link>
				</div>
			</footer>
		</main>
	);
};

export default Story;
