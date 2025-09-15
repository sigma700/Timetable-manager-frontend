//here is will have my timetable generation logic that i had defined in the backend

import { create } from 'zustand';

export const useGenStore = create((set) => ({
	relValue: null,
	isLoading: false,
	error: null,
	isCreated: false,
	idOfSchool: null,
	gottenTable: null,

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
				idOfSchool: data._id,
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
	listSubs: async (names, schoolId) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			const fetchUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${fetchUrl}/api/list-subjects`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
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
				error: data.message,
			});
		}
	},

	//listing all the classes in the school to make sure that the backend is properly suplemented with all the data thats is required
	listClasses: async (minLevel, maxLevel, type, labels, schoolId) => {
		set({ isLoading: true, error: null, isCreated: false });
		try {
			const fetcher = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${fetcher}/api/list-classData`, {
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
			const response = await fetch(`${usedUrl}/api/list-teachers`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ name, subjects, classesNames }),
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

	generateTabel: async (name, config) => {
		set({ isLoading: true, error: null, isCreated: false, relValue: null });
		try {
			const reqUrl = import.meta.env.VITE_BACKEND_URL;

			const response = await fetch(`${reqUrl}/api/gen-table`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include', //sends cookies for authentiaction !
				body: JSON.stringify({ name, config }),
			});

			const data = await response.json();
			console.log('data :', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
				relValue: data.data,
			});

			return data;
		} catch (error) {
			set({
				error: data.message,
				relValue: null,
				isCreated: false,
			});
			console.log(error);
			throw new Error(error);
		}
	},

	getTable: async (timetableId) => {
		set({ isLoading: true, isCreated: false, error: null, gottenTable: null });

		try {
			const response = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/api/getTable/${timetableId}`,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
					credentials: 'include',
				}
			);

			const data = await response.json();

			console.log('data : ', data);

			set({
				isLoading: false,
				isCreated: true,
				error: null,
				gottenTable: data.data,
			});

			return data;
		} catch (error) {
			set({
				error: 'There is an error somewhere with data parsing !',
				isCreated: false,
				isLoading: false,
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
}));
