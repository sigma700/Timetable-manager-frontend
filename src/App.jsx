import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

const router = createBrowserRouter([
	{ path: '/signUp', element: <SignUp /> },
	{ path: '/', element: <Home /> },
]);

const App = () => {
	return (
		<main className="">
			<RouterProvider router={router} />
		</main>
	);
};

export default App;
