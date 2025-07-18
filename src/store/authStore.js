import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
	user: null,
	value: null,
	isLoading: false,
	error: null,
	isAuthenticated: false,
	isCheckingAuth: false,

	initialize: async () => {
		if (get().isAuthenticated) return;

		set({ isCheckingAuth: true });
		try {
			await get().checkAuth(); // Reuse your existing checkAuth function
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	//actions
	signUp: async (email, password, firstName, lastName) => {
		set({ isLoading: true, error: null, isAuthenticated: false });
		try {
			const url = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${url}/api/create-account/686939ac65244f797d3334b7`, {
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
				isLoading: false,
			});
			throw error;
		}
	},

	//action for email verification
	verify: async (code) => {
		set({ isLoading: true, isAuthenticated: false, error: null });

		try {
			const fetchurl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${fetchurl}/api/verify`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ code }),
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
				isLoading: false,
			});
			console.log(error);

			throw new Error(error.message);
		}
	},

	checkAuth: async () => {
		set({ isLoading: true, error: null, isAuthenticated: false, user: null });
		try {
			const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/checkAuth`, {
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Authentication check failed !');
			}

			const data = await response.json();

			set({
				isLoading: false,
				error: null,
				isAuthenticated: true,
				user: data.message,
			});

			return true;
		} catch (error) {
			set({
				isLoading: false,
				error: data.message,
			});

			return false;
		}
	},
}));

useAuthStore.getState().initialize();
