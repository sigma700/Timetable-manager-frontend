import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import { useAuthStore } from './authStore';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Verif from './pages/Verif';
import MainPg from './pages/MainPg';

import { useAuthStore } from './store/authStore';
import LoadingSpinner from './pages/components/spinner';

const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, isCheckingAuth } = useAuthStore();

	if (isCheckingAuth) {
		return <LoadingSpinner />;
	}

	return isAuthenticated ? children : <Navigate to="/" replace />;
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/signUp',
		element: <SignUp />,
	},
	{
		path: '/verify',
		element: <Verif />,
	},
	{
		path: '/create',
		element: (
			<ProtectedRoute>
				<MainPg />
			</ProtectedRoute>
		),
	},
]);

function App() {
	const { initialize } = useAuthStore();

	useEffect(() => {
		initialize();
	}, [initialize]);

	return (
		<div className="app">
			<RouterProvider router={router} />
		</div>
	);
}

export default App;
