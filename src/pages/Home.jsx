import React from "react";
import {Link} from "react-router-dom";
import {motion} from "framer-motion";

const Home = () => {
  const userName = "Educator"; // Changed to a more relevant default name

  // Animation variants
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const buttonVariants = {
    rest: {scale: 1},
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {scale: 0.95},
  };

  return (
    <main className="bg-gradient-to-br from-slate-900 via-slate-800 to-neutral-900 min-h-screen flex justify-center items-center w-full px-4 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Animated background elements */}
        {Array.from({length: 5}).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-500/10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex flex-col items-center bg-gradient-to-br from-slate-800/40 via-slate-800/30 to-slate-900/20 rounded-3xl shadow-2xl p-8 md:p-10 max-w-md w-full border border-slate-700/30 backdrop-blur-sm"
          variants={itemVariants}
          whileHover={{y: -5}}
          transition={{duration: 0.3}}
        >
          <motion.div
            className="mb-6"
            initial={{scale: 0, rotate: -180}}
            animate={{scale: 1, rotate: 0}}
            transition={{
              type: "spring",
              stiffness: 100,
              duration: 1,
              delay: 0.5,
            }}
          >
            <img
              src="/nick-fewings-mFz6-QAzd1I-unsplash-min.jpg"
              alt="Welcome illustration"
              className="rounded-[10px] mx-auto"
            />
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-center bg-gradient-to-r from-white to-slate-200 bg-clip-text"
            variants={itemVariants}
          >
            Welcome to <span className="text-amber-400">Protiba</span>
          </motion.h1>

          <motion.p
            className="text-xl text-slate-300 text-center mb-6 leading-relaxed"
            variants={itemVariants}
          >
            Hello, {userName}! We're excited to help you create perfect
            timetables with ease.
          </motion.p>

          <motion.div
            className="w-full bg-slate-700/30 rounded-xl p-4 mb-6"
            variants={itemVariants}
          >
            <h3 className="text-slate-100 font-medium mb-2 text-center">
              Why choose Protiba?
            </h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-emerald-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Automated timetable generation
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-emerald-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Conflict-free scheduling
              </li>
              <li className="flex items-center">
                <svg
                  className="w-4 h-4 text-emerald-400 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Easy-to-use interface
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          variants={buttonVariants}
          initial="rest"
          whileHover="hover"
          whileTap="tap"
        >
          <Link
            to={"/signUp"}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 font-medium py-4 px-8 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-amber-500/20 transition-all duration-300"
          >
            Get Started
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </motion.div>

        <motion.p
          className="text-slate-400 mt-6 text-sm"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{delay: 1.5, duration: 1}}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-amber-400 hover:text-amber-300 underline transition-colors"
          >
            Sign in here
          </Link>
        </motion.p>
      </motion.div>
    </main>
  );
};

export default Home;
