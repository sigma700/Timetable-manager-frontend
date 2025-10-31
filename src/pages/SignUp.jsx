import React, {useState} from "react";
import {useAuthStore} from "../store/authStore";
import {useNavigate, Link} from "react-router-dom";
import {motion} from "framer-motion";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {signUp, isLoading, error} = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    try {
      await signUp(email, password, firstName, lastName);
      navigate("/home");
    } catch (error) {}
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="bg-gradient-to-b from-slate-900 via-slate-800 to-neutral-900 min-h-screen flex justify-center items-center w-full p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row items-center bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 p-6 lg:p-8 rounded-3xl shadow-2xl border border-slate-700/30 backdrop-blur-sm max-w-4xl w-full">
        {/* Illustration Side */}
        <div className="lg:w-1/2 mb-8 lg:mb-0 lg:pr-8 flex justify-center">
          <div className="text-center">
            <img
              src="/nathan-dumlao-5Hl5reICevY-unsplash-min-Photoroom.png"
              alt="Security illustration"
              className="w-56 lg:w-72 mx-auto mb-6"
            />
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-3">
              Join Us Today
            </h1>
            <p className="text-slate-300 text-sm lg:text-base max-w-md">
              Create your account and start managing your schedules with ease
              and security.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="lg:w-1/2 w-full">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* {error && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-xl p-3">
                <small className="text-red-300 font-medium">{error}</small>
              </div>
            )} */}

            {/* Name Fields */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  className="text-white font-light text-sm"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  className="text-white font-light text-sm"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="text-white font-light text-sm"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  className="bg-gray-100 text-black p-3 rounded-xl w-full placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-400 transition-all pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <motion.svg
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </motion.svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 text-slate-600 rounded focus:ring-slate-500 mt-1"
              />
              <label
                htmlFor="terms"
                className="text-slate-300 text-sm cursor-pointer"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-slate-100 hover:text-white underline"
                >
                  terms and conditions
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-slate-600 to-slate-800 text-white p-3 rounded-xl font-medium hover:from-slate-700 hover:to-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-700/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Loading Indicator */}
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
                <span className="text-slate-300">Creating your account...</span>
              </div>
            )}

            {/* Already have an account section */}
            <div className="text-center pt-4 border-t border-slate-600/50 mt-6">
              <p className="text-slate-300 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-slate-100 hover:text-white font-medium underline transition-colors"
                >
                  Login instead
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
