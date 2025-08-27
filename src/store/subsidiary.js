import { create } from 'zustand';

export const useSubStore = create((set) => ({
	error: null,
	isLoading: false,

	bookSess: async (fullName, email, schName, date, time) => {
		set({ isLoading: true, error: null });
		try {
			const backUrl = import.meta.env.VITE_BACKEND_URL;
			const response = await fetch(`${backUrl}/api/bookDemo`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify({ fullName, email, schName, date, time }),
			});

			const gottenData = await response.json();
			console.log(gottenData);

			set({
				isLoading: false,
				error: null,
			});
		} catch (error) {
			set({
				isLoading: false,
				error: gottenData.message,
			});
		}
	},
}));
