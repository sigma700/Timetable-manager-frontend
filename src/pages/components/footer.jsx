import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="bg-gradient-to-b from-slate-900 to-slate-800 border-t border-slate-700/30 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Brand Section */}
					<div className="col-span-1 lg:col-span-2">
						<Link to="/" className="flex items-center mb-4">
							<span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
								Protiba
							</span>
						</Link>
						<p className="text-slate-300 max-w-md mb-6">
							Intelligent timetable generation for educational institutions. Save time and eliminate
							scheduling conflicts with our advanced algorithm.
						</p>

						{/* social links section  */}
						<div className="flex space-x-4">
							<a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
							</a>
							<a
								href="https://github.com/sigma700"
								target="blank"
								className="text-slate-400 hover:text-amber-400 transition-colors"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
								</svg>
							</a>
							<a
								href="https://www.linkedin.com/in/allan-kirimi-31ba92323/"
								target="blank"
								className="text-slate-400 hover:text-amber-400 transition-colors"
							>
								<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
									<path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
								</svg>
							</a>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="text-slate-100 font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							<li>
								<Link
									to="/home/demo"
									className="text-slate-400 hover:text-amber-400 transition-colors"
								>
									Demo
								</Link>
							</li>
							<li>
								<Link
									to="/pricing"
									className="text-slate-400 hover:text-amber-400 transition-colors"
								>
									Pricing
								</Link>
							</li>
							<li>
								<Link
									to="/home/manual"
									className="text-slate-400 hover:text-amber-400 transition-colors"
								>
									Manual
								</Link>
							</li>
							<li>
								<Link
									to="/support"
									className="text-slate-400 hover:text-amber-400 transition-colors"
								>
									Support
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className="text-slate-100 font-semibold mb-4">Contact Us</h3>
						<ul className="space-y-2 text-slate-400">
							<li className="flex items-start">
								<svg
									className="w-5 h-5 mr-2 mt-0.5 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span>allankirimi65@gmail.com</span>
							</li>
							<li className="flex items-start">
								<svg
									className="w-5 h-5 mr-2 mt-0.5 text-amber-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
									/>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
									/>
								</svg>
								<span>Nyeri, Kenya</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="border-t border-slate-700/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
					<p className="text-slate-400 text-sm">
						© {new Date().getFullYear()} Protiba. All rights reserved.
					</p>
					<div className="flex space-x-6 mt-4 md:mt-0">
						<Link
							to="/privacy"
							className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
						>
							Privacy Policy
						</Link>
						<Link
							to="/terms"
							className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
						>
							Terms of Service
						</Link>
						<Link
							to="/cookies"
							className="text-slate-400 hover:text-amber-400 text-sm transition-colors"
						>
							Cookie Policy
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
