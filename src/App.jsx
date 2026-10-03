import React from "react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes";

// Auth boot happens once, in authStore (initialize() on import). The previous
// App also called checkAuth() in useEffect, so every page load hit
// /api/check-Auth twice.
const App = () => <RouterProvider router={router} />;

export default App;
