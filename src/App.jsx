import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Verif from './pages/Verif';
import MainPg from './pages/MainPg';
import { useAuthStore } from './store/authStore';

const router = createBrowserRouter([
	{ path: '/signUp', element: <SignUp /> },
	{ path: '/verify', element: <Verif /> },
	{ path: '/', element: <Home /> },
	{ path: '/create', element: <MainPg /> },
]);

const App = () => {
	const { isAuthenticated, checkAuth, isCheckingAuth, user } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	console.log(user);

	return (
		<main className="">
			<RouterProvider router={router} />
		</main>
	);
};

export default App;
