import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Verif from './pages/Verif';
import MainPg from './pages/MainPg';
import { useAuthStore } from './store/authStore';
import LoadingSpinner from './pages/components/spinner';
import Create from './pages/Create';
import Generation from './pages/Generation';
import Timetables from './pages/Timetables';
import Login from './pages/Login';
import Terms from './pages/Terms';
import UserManual from './pages/Manual';
import Demo from './pages/Demo';
import Invite from './pages/Invite';
import Contacts from './pages/Contacts';
import Footer from './pages/components/footer';
import Story from './pages/Story';
// import Footer from './components/Footer'; // Import the Footer component

// Layout component that includes the footer
const Layout = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-grow">{children}</div>
			<Footer />
		</div>
	);
};

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

// Create a wrapper component for each route
const RouteWrapper = ({ children, isProtected = false, isPublicOnly = false }) => {
	if (isProtected) {
		return (
			<ProtectedRoute>
				<Layout>{children}</Layout>
			</ProtectedRoute>
		);
	}

	if (isPublicOnly) {
		return (
			<PublicOnlyRoute>
				<Layout>{children}</Layout>
			</PublicOnlyRoute>
		);
	}

	return <Layout>{children}</Layout>;
};

const router = createBrowserRouter([
	{
		path: '/home/gentable',
		element: (
			<RouteWrapper isProtected={true}>
				<Generation />
			</RouteWrapper>
		),
	},
	{
		path: '/home/timetables',
		element: (
			<RouteWrapper isProtected={true}>
				<Timetables />
			</RouteWrapper>
		),
	},
	{
		path: '/home/manual',
		element: (
			<RouteWrapper isProtected={true}>
				<UserManual />
			</RouteWrapper>
		),
	},
	{
		path: '/home/demo',
		element: (
			<RouteWrapper isProtected={true}>
				<Demo />
			</RouteWrapper>
		),
	},
	{
		path: '/home/invite',
		element: (
			<RouteWrapper isProtected={true}>
				<Invite />
			</RouteWrapper>
		),
	},
	{
		path: '/home/story',
		element: (
			<RouteWrapper isProtected={true}>
				<Story />
			</RouteWrapper>
		),
	},
	{
		path: '/home/create-table',
		element: (
			<RouteWrapper isProtected={true}>
				<Create />
			</RouteWrapper>
		),
	},
	{
		path: '/home/contacts',
		element: (
			<RouteWrapper isProtected={true}>
				<Contacts />
			</RouteWrapper>
		),
	},
	{
		path: '/logIn',
		element: (
			<RouteWrapper isPublicOnly={true}>
				<Login />
			</RouteWrapper>
		),
	},
	{
		path: '/terms',
		element: (
			<RouteWrapper isPublicOnly={true}>
				<Terms />
			</RouteWrapper>
		),
	},
	{
		path: '/signUp',
		element: (
			<RouteWrapper isPublicOnly={true}>
				<SignUp />
			</RouteWrapper>
		),
	},
	{
		path: '/verify',
		element: (
			<RouteWrapper isPublicOnly={true}>
				<Verif />
			</RouteWrapper>
		),
	},
	{
		path: '/',
		element: (
			<RouteWrapper isPublicOnly={true}>
				<Home />
			</RouteWrapper>
		),
	},
	{
		path: '/home',
		element: (
			<RouteWrapper isProtected={true}>
				<MainPg />
			</RouteWrapper>
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
