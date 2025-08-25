import React, { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FullMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="h-full">
			<AnimatedHamburgerBtn active={isOpen} setActive={setIsOpen} />

			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.7 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black z-10"
							onClick={() => setIsOpen(false)}
						/>

						{/* Main Content */}
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{
								width: '100%',
								opacity: 1,
								transition: { duration: 0.5, ease: 'easeInOut' },
							}}
							exit={{
								width: 0,
								opacity: 0,
								transition: { duration: 0.5, ease: 'easeInOut' },
							}}
							className="fixed inset-0 z-20 flex items-center justify-center"
						>
							<motion.div
								initial={{ x: -100, opacity: 0 }}
								animate={{
									x: 0,
									opacity: 1,
									transition: { delay: 0.3, duration: 0.5 },
								}}
								exit={{
									x: -100,
									opacity: 0,
									transition: { duration: 0.3 },
								}}
								className="w-full max-w-2xl px-4"
							>
								<NavigatorCont />
							</motion.div>

							<motion.div
								initial={{ x: -100, opacity: 0 }}
								animate={{
									x: 0,
									opacity: 1,
									transition: { delay: 0.5, duration: 0.5 },
								}}
								exit={{
									x: -100,
									opacity: 0,
									transition: { duration: 0.2 },
								}}
								className="absolute bottom-8 left-0 right-0 flex justify-center"
							>
								<Socials />
							</motion.div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

const NavigatorCont = () => {
	// const menuItems = ['Home', 'Contact Us', 'Request Demo', 'Settings'];
	const menuItems = [
		{
			title: 'Home',
			path: '/home',
		},
		{
			title: 'Contact Us',
			path: '/contacts',
		},
		{
			title: 'Request Demo',
			path: '/home/demo',
		},
		{
			title: 'Settings',
			path: '/settings',
		},
	];

	return (
		<main>
			<ul className="text-[30px] lg:text-[40px] font-extrabold text-gray-400 space-y-6">
				{menuItems.map((item, index) => (
					<Link to={item.path}>
						<motion.li
							key={item}
							initial={{ x: -50, opacity: 0 }}
							animate={{
								x: 0,
								opacity: 1,
								transition: { delay: 0.7 + index * 0.1, duration: 0.5 },
							}}
							exit={{
								x: -50,
								opacity: 0,
								transition: { duration: 0.2 },
							}}
							className="hover:text-white hover:transition-colors hover:duration-[0.3s] duration-[0.3s] hover:cursor-pointer text-center"
						>
							{item.title}
						</motion.li>
					</Link>
				))}
			</ul>
		</main>
	);
};

const Socials = () => {
	const socialIcons = [
		{ src: 'src/assets/facebook.svg', alt: 'Facebook' },
		{ src: 'src/assets/github.svg', alt: 'GitHub' },
		{ src: 'src/assets/twitter.svg', alt: 'Twitter' },
		{ src: 'src/assets/instagram.svg', alt: 'Instagram' },
	];

	return (
		<main>
			<ul className="flex gap-[20px]">
				{socialIcons.map((icon, index) => (
					<motion.li
						key={icon.alt}
						initial={{ x: -20, opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: { delay: 1.1 + index * 0.1, duration: 0.5 },
						}}
						exit={{
							x: -20,
							opacity: 0,
							transition: { duration: 0.2 },
						}}
					>
						<img
							className="lg:w-[50px] hover:bg-gray-600 p-[10px] rounded-full hover:cursor-pointer hover:transition-all hover:duration-[0.3s] duration-[0.4s] w-[30px]"
							src={icon.src}
							alt={icon.alt}
						/>
					</motion.li>
				))}
			</ul>
		</main>
	);
};

const AnimatedHamburgerBtn = ({ active, setActive }) => {
	return (
		<MotionConfig
			transition={{
				duration: 0.4,
				ease: 'easeInOut',
			}}
		>
			<motion.button
				onClick={() => setActive(!active)}
				initial={false}
				className="absolute left-4 top-4 h-20 w-20 rounded-full bg-white/0 transition-colors hover:bg-white/20 z-30"
				animate={active ? 'open' : 'closed'}
			>
				<motion.span
					style={{
						left: '50%',
						top: '35%',
						x: '-50%',
						y: '-50%',
					}}
					className="absolute h-1 w-10 bg-white"
					variants={{
						open: {
							rotate: ['0deg', '0deg', '45deg'],
							top: ['35%', '50%', '50%'],
						},
						closed: {
							top: ['50%', '50%', '35%'],
							rotate: ['45deg', '0deg', '0deg'],
						},
					}}
				/>
				<motion.span
					style={{
						left: '50%',
						top: '50%',
						x: '-50%',
						y: '-50%',
					}}
					className="absolute h-1 w-10 bg-white"
					variants={{
						open: {
							rotate: ['0deg', '0deg', '-45deg'],
						},
						closed: {
							rotate: ['-45deg', '0deg', '0deg'],
						},
					}}
				/>
				<motion.span
					style={{
						left: 'calc(50% + 10px)',
						bottom: '35%',
						x: '-50%',
						y: '-50%',
					}}
					className="absolute h-1 w-5 bg-white"
					variants={{
						open: {
							rotate: ['0deg', '0deg', '45deg'],
							left: '50%',
							bottom: ['35%', '50%', '50%'],
						},
						closed: {
							rotate: ['45deg', '0deg', '0deg'],
							left: 'calc(50% + 10px)',
							bottom: ['50%', '50%', '35%'],
						},
					}}
				/>
			</motion.button>
		</MotionConfig>
	);
};
