//here is will have my timetable generation logic that i had defined in the backend

import { create } from 'zustand';

export const useGenStore = create((set) => ({
	value: null,
	isLoading: false,
	error: null,
	isCreated: false,

	//actions for making all of that happen in real sense

	listName: async (name) => {
		set({ isLoading: true, value: null, isCreated: false });

		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${backendUrl}/api/list-school`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ name }),
			});
			const data = await response.json();
			console.log('data', data);

			set({
				isLoading: false,
				error: null,
				value: data.data, //this part has to get checked well
				isCreated: true,
			});

			return data;
		} catch (error) {
			set({
				error: data.message,
				isLoading: false,
			});
			console.log(error);
			throw new Error(error);
		}
	},

	//listing all the subjects that are taught in the school
	listSubs: async (names, schoolId) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			const fetchUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${fetchUrl}/api/list-subjects/${schoolId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ names, schoolId }),
			});

			//reasign the response varible to make sure that the data we are getting is in json format

			const data = await response.json();
			console.log('data :', data);

			//now set final variables after creating
			set({
				isLoading: false,
				isCreated: true,
				error: null,
			});

			//return the data
			return data;
		} catch (error) {
			set({
				isLoading: false,
			});
		}
	},

	//listing all the classes in the school to make sure that the backend is properly suplemented with all the data thats is required
	listClasses: async (minLevel, maxLevel, type, labels, schoolId) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			const fetcher = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${fetcher}/api/list-classData/${schoolId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ minLevel, maxLevel, labels, type }),
			});

			const data = await response.json();
			console.log('data: ', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
			});

			return data;
		} catch (error) {
			set({
				isLoading: false,
				isCreated: false,
				error: data.message,
			});
			console.log(error);
			throw new Error(error);
		}
	},

	//listing all the teachers that are in the school to suplement our backend logic

	listTichs: async (name, subjects, classesNames, schoolId) => {
		set({ isLoading: true, isCreated: false, error: null });

		try {
			const usedUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${usedUrl}/api/list-teachers/${schoolId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name, subjects, classesNames, schoolId }),
			});

			const data = await response.json();
			console.log('data : ', data);

			//setters

			set({
				isLoading: false,
				isCreated: true,
				error: null,
			});

			//done well
			return data;
		} catch (error) {
			set({
				isCreated: false,
				error: data.message,
				isLoading: false,
			});
			console.log(error);
			throw new Error(error);
		}
	},

	//lets now add the last one for creating the timetable for the user
	//TODO:CHECK WHAT IS EXPECTED IN THE BACKEND LOGIC

	generateTabel: async (config, schoolId) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			const reqUrl = import.meta.env.VITE_BACKEND_URL;

			const response = await fetch(`${reqUrl}/api/gen-table/${schoolId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ config }),
			});

			const data = await response.json();
			console.log('data :', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
				value: data.data,
			});

			return data;
		} catch (error) {
			set({
				error: data.message,
				value: null,
				isCreated: false,
			});
			console.log(error);
			throw new Error(error);
		}
	},

	//now for deleting the timetable

	delTable: async (tableId) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			const requiredRl = import.meta.env.VITE_BACKEND_URL;

			const response = await fetch(`${requiredRl}/api/deltable`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ tableId }),
			});

			const data = await response.json();
			console.log('data: ', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
			});
			return data;
		} catch (error) {
			set({
				error: data.message,
				isCreated: false,
			});
			console.log(error);
			throw new Error(error);
		}
	},

	//updaaating the already created timetable
	updateTable: async (id, updates) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			//calling our endpoints
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/updateTable/${id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id, updates }),
				credentials: 'include',
			});

			const data = await response.json();
			console.log('data : ', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
			});

			//returning our data
			return data;
		} catch (error) {
			set({
				isCreated: false,
				error: data.message,
			});

			console.log(error);
			throw new Error(error);
		}
	},

	//function for getting the timetable

	getTable: async () => {
		set({ isLoading: true, isCreated: false, error: null });

		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getTable`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			const data = await response.json();

			console.log('data : ', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
			});

			return data;
		} catch (error) {
			set({
				error: data.message,
				isCreated: false,
			});

			console.log(error);
			throw new Error(error);
		}
	},
}));
