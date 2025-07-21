import React from 'react';
import { FiBookOpen, FiMail, FiPlus, FiUser, FiUsers } from 'react-icons/fi';
import { RiLiveFill } from 'react-icons/ri';
import { CiShare2 } from 'react-icons/ci';
import { Link } from 'react-router-dom';

const HoverDevCards = () => {
	return (
		<div className="p-4">
			<p className="text-xl font-semibold mb-2">Actions</p>
			<div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
				<Card
					title="Create Timetable"
					subtitle="Start creating"
					path="create-table"
					Icon={FiPlus}
				/>
				<Card title="User manual" subtitle="View manual" path="manual" Icon={FiBookOpen} />
				<Card
					title="Schedule Demo"
					subtitle="Live guidance session"
					path="demo"
					Icon={RiLiveFill}
				/>
				<Card title="Invite Others" subtitle="https://" path="invite" Icon={CiShare2} />
			</div>
		</div>
	);
};

const Card = ({ title, subtitle, Icon, path }) => {
	return (
		<Link
			to={path}
			className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

			<Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
			<Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
			<h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300">
				{title}
			</h3>
			<p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
				{subtitle}
			</p>
		</Link>
	);
};

export default HoverDevCards;
