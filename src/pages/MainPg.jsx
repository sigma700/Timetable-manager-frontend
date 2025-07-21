import React from 'react';
import { FullMenu } from './components/animatedHamb';

const MainPg = () => {
	return (
		<main className="relative h-screen bg-gradient-to-r from-slate-900 to-slate-900 overflow-hidden">
			<div>
				<FullMenu />
			</div>
		</main>
	);
};

export default MainPg;
