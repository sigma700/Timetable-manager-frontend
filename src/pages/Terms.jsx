import React from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
	return (
		<main className="bg-gradient-to-b from-slate-900 to-neutral-900 min-h-screen text-white">
			{/* Header */}
			<div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50">
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
						</nav>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 py-12 max-w-4xl">
				<div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 rounded-3xl p-8 lg:p-12 border border-slate-700/30 backdrop-blur-sm">
					{/* Header Section */}
					<div className="text-center mb-12">
						<h1 className="text-3xl lg:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-400">
							Terms and Conditions
						</h1>
						<p className="text-slate-300 text-lg">
							Last updated: {new Date().toLocaleDateString()}
						</p>
					</div>

					{/* Terms Content */}
					<div className="space-y-8 text-slate-200">
						{/* Introduction */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								1. Introduction
							</h2>
							<p className="leading-relaxed">
								Welcome to Timetable Manager. These Terms and Conditions govern your use of our
								timetable management application and services. By accessing or using our platform,
								you agree to be bound by these terms.
							</p>
						</section>

						{/* Account Terms */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								2. Account Registration
							</h2>
							<ul className="space-y-3 list-disc list-inside">
								<li>You must provide accurate and complete information during registration</li>
								<li>
									You are responsible for maintaining the confidentiality of your account
									credentials
								</li>
								<li>You must be at least 13 years old to use our services</li>
								<li>
									We reserve the right to suspend or terminate accounts that violate these terms
								</li>
							</ul>
						</section>

						{/* User Conduct */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								3. Acceptable Use
							</h2>
							<p className="mb-3">You agree not to:</p>
							<ul className="space-y-2 list-disc list-inside">
								<li>Use the service for any illegal or unauthorized purpose</li>
								<li>Modify, adapt, or hack the service</li>
								<li>Transmit any viruses, worms, or malicious code</li>
								<li>Attempt to gain unauthorized access to any part of the service</li>
								<li>Use the service to infringe upon intellectual property rights</li>
							</ul>
						</section>

						{/* Data Privacy */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								4. Data Privacy and Security
							</h2>
							<p className="leading-relaxed">
								We take your privacy seriously. Your timetable data and personal information are
								stored securely. We implement industry-standard security measures to protect your
								data. For more details, please refer to our Privacy Policy.
							</p>
						</section>

						{/* Intellectual Property */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								5. Intellectual Property
							</h2>
							<p className="leading-relaxed">
								The Timetable Manager platform, including its design, code, and branding, is
								protected by intellectual property laws. You retain ownership of your timetable
								data, but grant us a license to store and process it for service provision.
							</p>
						</section>

						{/* Limitation of Liability */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								6. Limitation of Liability
							</h2>
							<p className="leading-relaxed">
								Timetable Manager is provided "as is" without warranties of any kind. We are not
								liable for any damages resulting from the use or inability to use our service,
								including but not limited to timetable scheduling errors or data loss.
							</p>
						</section>

						{/* Service Modifications */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								7. Service Changes and Termination
							</h2>
							<p className="leading-relaxed">
								We reserve the right to modify, suspend, or discontinue any part of the service at
								any time. We may also terminate your access to the service for violations of these
								terms.
							</p>
						</section>

						{/* Governing Law */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								8. Governing Law
							</h2>
							<p className="leading-relaxed">
								These terms shall be governed by and construed in accordance with the laws of your
								jurisdiction. Any disputes shall be resolved in the courts of competent
								jurisdiction.
							</p>
						</section>

						{/* Changes to Terms */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								9. Changes to Terms
							</h2>
							<p className="leading-relaxed">
								We may update these Terms and Conditions from time to time. We will notify users of
								significant changes through the application or via email. Continued use of the
								service constitutes acceptance of the updated terms.
							</p>
						</section>

						{/* Contact */}
						<section>
							<h2 className="text-xl font-semibold text-white mb-4 border-l-4 border-indigo-500 pl-3">
								10. Contact Information
							</h2>
							<p className="leading-relaxed">
								If you have any questions about these Terms and Conditions, please contact us at:
								<br />
								<span className="text-indigo-300">support@timetablemanager.com</span>
							</p>
						</section>
					</div>

					{/* Acceptance Section */}
					<div className="mt-12 p-6 bg-slate-800/50 rounded-xl border border-slate-700/30">
						<h3 className="text-lg font-semibold text-white mb-3 text-center">
							Acceptance of Terms
						</h3>
						<p className="text-slate-300 text-center">
							By using Timetable Manager, you acknowledge that you have read, understood, and agree
							to be bound by these Terms and Conditions.
						</p>
					</div>

					{/* Navigation Links */}
					<div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
						<Link
							to="/signup"
							className="bg-gradient-to-r from-slate-600 to-slate-800 text-white px-6 py-3 rounded-xl font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-300 text-center"
						>
							Back to Sign Up
						</Link>
						<Link
							to="/login"
							className="border border-slate-600 text-slate-300 px-6 py-3 rounded-xl font-medium hover:border-slate-400 hover:text-white transition-all duration-300 text-center"
						>
							Go to Login
						</Link>
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="bg-gradient-to-r from-slate-900 to-slate-800 border-t border-slate-700/50 mt-16">
				<div className="container mx-auto px-4 py-6 text-center">
					<p className="text-slate-400 text-sm">
						© {new Date().getFullYear()} Timetable Manager. All rights reserved.
					</p>
				</div>
			</footer>
		</main>
	);
};

export default Terms;
