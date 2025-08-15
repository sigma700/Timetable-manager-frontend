import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useGenStore } from '../store/generativeStore';

const Timetables = () => {
	const { isAuthenticated, requiredData } = useAuthStore();
	const { getTable, gottenTable } = useGenStore();

	useEffect(() => {
		if (isAuthenticated && requiredData) {
			getTable(requiredData);
		}
	}, [isAuthenticated, requiredData]);
	return (
		<main className="text-white min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
			<div>
				<p>{gottenTable}</p>
			</div>
		</main>
	);
};

export default Timetables;
