import { create } from 'zustand';

export const useAuthStore = create((set) => ({
	user: null,
	value: null,
	isLoading: true,
	error: null,
	isAuthenticated: false,
	isCheckingAuth: false,

	//actions
	signUp: async (email, password, firstName, lastName) => {
		set({ isLoading: true, error: null, isAuthenticated: false });
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${url}/api/create-account`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, firstName, lastName, password }),
				credentials: 'include',
			});
			const fetchedData = await response.json();

			if (!response.ok) {
				throw new Error(fetchedData.message || 'Signup failed !');
			}

			set({
				user: fetchedData.data,
				isAuthenticated: true,
				isLoading: false,
			});

			return fetchedData;
		} catch (error) {
			console.log(error);

			set({
				error: error.message,
			});
			throw error;
		}
	},

	//action for email verification
	verify: async (verToken) => {
		set({ isLoading: true, isAuthenticated: false, error: null });

		try {
			const fetchurl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${fetchurl}/api/verify`, {
				method: 'POST',
				headers: {
					'Contetnt-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ verToken }),
			});

			const data = await response.json();
			console.log('data', data);

			set({
				isLoading: false,
				isAuthenticated: true,
				error: null,
			});

			return data;
		} catch (error) {
			set({
				error: error.message,
			});
			console.log(error);

			throw new Error(error.message);
		}
	},

	//i will add one for login right after making creating the endpoint in the backend
}));
