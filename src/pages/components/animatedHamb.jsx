import React, { useState } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';

export const FullMenu = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative h-screen bg-gradient-to-r from-slate-900 to-slate-900 overflow-hidden">
			<AnimatedHamburgerBtn active={isOpen} setActive={setIsOpen} />

			{/* Menu Content */}
			<AnimatePresence>
				{isOpen && (
					<>
						<motion.div
							initial={{ x: -300, opacity: 0 }}
							animate={{
								x: 0,
								opacity: 1,
								transition: { type: 'spring', stiffness: 100, damping: 15 },
							}}
							exit={{
								x: -300,
								opacity: 0,
								transition: { duration: 0.3 },
							}}
							className="absolute left-24 top-0 p-8 z-20"
						>
							<NavigatorCont />
						</motion.div>

						<motion.div
							initial={{ x: -300, opacity: 0 }}
							animate={{
								x: 0,
								opacity: 1,
								transition: { delay: 0.1, type: 'spring', stiffness: 100, damping: 15 },
							}}
							exit={{
								x: -300,
								opacity: 0,
								transition: { duration: 0.2 },
							}}
							className="absolute left-24 bottom-4 p-8 z-20"
						>
							<Socials />
						</motion.div>

						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 0.7 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black z-10"
							onClick={() => setIsOpen(false)}
						/>
					</>
				)}
			</AnimatePresence>
		</div>
	);
};

const NavigatorCont = () => {
	const menuItems = ['Home', 'Contact Us', 'Request Demo', 'Settings'];

	return (
		<motion.main className="lg:absolute top-1/3 lg:left-4">
			<ul className="text-[30px] lg:text-[40px] font-extrabold text-gray-400 space-y-4">
				{menuItems.map((item, index) => (
					<motion.li
						key={item}
						initial={{ x: -50, opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: { delay: 0.2 + index * 0.1 },
						}}
						exit={{
							x: -50,
							opacity: 0,
							transition: { duration: 0.2 },
						}}
						className="hover:text-white hover:transition-colors hover:duration-[0.3s] duration-[0.3s] hover:cursor-pointer"
					>
						{item}
					</motion.li>
				))}
			</ul>
		</motion.main>
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
		<motion.main className="left-4">
			<ul className="flex gap-[20px]">
				{socialIcons.map((icon, index) => (
					<motion.li
						key={icon.alt}
						initial={{ x: -20, opacity: 0 }}
						animate={{
							x: 0,
							opacity: 1,
							transition: { delay: 0.5 + index * 0.1 },
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
		</motion.main>
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
