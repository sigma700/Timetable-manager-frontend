import React, { useEffect, useState } from 'react';
import { useGenStore } from '../store/generativeStore';
import Timetable from './components/timetable';
import LoadingSpinner from './components/spinner';

const Timetables = () => {
	const { getTable, isLoading, isCreated, relValue, error } = useGenStore();
	const [name, setName] = useState('');
	const [tableId, setTableId] = useState('');
	//this part requires a check for validation options especially on the part of the setTableId

	return (
		<main className="text-white min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-auto">
			<div>
				
			</div>
		</main>
	);
};

export default Timetables;
