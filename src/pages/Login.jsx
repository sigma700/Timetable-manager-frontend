import React, {useState} from "react";
import {useAuthStore} from "../store/authStore";
import {useNavigate, Link} from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {logIn, isLoading, error} = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await logIn(email, password);
      navigate("/home");
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <main className="bg-gradient-to-b from-slate-900 to-neutral-900 min-h-screen flex justify-center items-center w-full p-4">
      <div className="flex flex-col lg:flex-row items-center bg-gradient-to-r from-slate-900 to-slate-700 p-6 lg:p-8 rounded-2xl shadow-2xl border border-slate-600/30">
        {/* Illustration Side */}
        <div className="lg:w-1/2 mb-6 lg:mb-0 lg:pr-8 flex justify-center">
          <img
            src="/Time management-pana.svg"
            alt="Login illustration"
            className="w-64 lg:w-80"
          />
        </div>

        {/* Form Side */}
        <div className="lg:w-1/2 w-full">
          <div className="text-center mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-300 text-sm">
              Sign in to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-white font-light text-sm" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-white font-light text-sm"
                htmlFor="password"
              >
                Password
              </label>
              <input
                id="password"
                className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500"
                />
                <span className="text-slate-300">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-800 text-white p-3 rounded-xl font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-700/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>

            {isLoading && (
              <div className="flex items-center justify-center my-4">
                <svg
                  className="animate-spin h-5 w-5 text-slate-400 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span className="text-slate-300">Authenticating...</span>
              </div>
            )}

            <div className="text-center pt-4 border-t border-slate-600/50 mt-4">
              <p className="text-slate-300 text-sm">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-slate-100 hover:text-white font-medium underline transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default Login;
