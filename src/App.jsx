import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Verif from './pages/Verif';
import MainPg from './pages/MainPg';
import { useAuthStore } from './store/authStore';
import LoadingSpinner from './pages/components/spinner';

// Protected route component
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) {
		return (
			<div>
				<LoadingSpinner />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return children;
};

// Public-only route component
const PublicOnlyRoute = ({ children }) => {
	const { isAuthenticated, isCheckingAuth, user } = useAuthStore();

	if (isCheckingAuth) {
		return (
			<div>
				<LoadingSpinner />
			</div>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/home" replace />;
	}

	return children;
};

const router = createBrowserRouter([
	{
		path: '/signUp',
		element: (
			<PublicOnlyRoute>
				<SignUp />
			</PublicOnlyRoute>
		),
	},
	{
		path: '/verify',
		element: (
			<PublicOnlyRoute>
				<Verif />
			</PublicOnlyRoute>
		),
	},
	{
		path: '/',
		element: (
			<PublicOnlyRoute>
				<Home />
			</PublicOnlyRoute>
		),
	},
	{
		path: '/home',
		element: (
			<ProtectedRoute>
				<MainPg />
			</ProtectedRoute>
		),
	},
]);

const App = () => {
	const { checkAuth, user } = useAuthStore();
	// console.log(user); got back allan

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<main className="">
			<RouterProvider router={router} />
		</main>
	);
};

export default App;
