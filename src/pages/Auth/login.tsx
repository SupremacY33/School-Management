import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import Loader from "../../components/loader";
import AlertMessage from "../../components/alertMessage";
import SchoolBackground from "../../images/kasbIns.jpg";

const LoginPage: React.FC = () => {
  const [studentUsername, setStudentUsername] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentUsername || !studentPassword) {
      setError("Please fill out both fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://localhost:7072/api/Student/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentUsername, studentPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }

      const data = await response.json();
      const token = data.token;
      if (!token) throw new Error("Token missing from response.");

      login(token);
      window.location.href = "/dashboard";
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50">
      {/* Left Side - Background Image */}
      <div
        className="relative hidden md:flex md:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: `url(${SchoolBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-teal-700/40"></div>

        <div className="absolute bottom-10 left-10 text-white drop-shadow-lg">
          <h1 className="text-4xl font-bold">Welcome Back</h1>
          <p className="text-lg mt-2 opacity-90">
            Log in to manage your student dashboard
          </p>
        </div>
      </div>

      {/* Right Side - Login Card */}
      <div className="flex items-center justify-center w-full md:w-1/2 px-4 sm:px-8 md:px-12 lg:px-20 py-10">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Logo Header */}
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-teal-500 mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M5 3l14 9-14 9V3z"
              />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Student Portal
            </h1>
          </div>

          {/* Login Form */}
          <h2 className="text-center text-xl sm:text-2xl font-semibold mb-5 text-gray-700">
            Log in to your account
          </h2>

          {error && <AlertMessage type="danger" message={error} />}
          {loading && <Loader />}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Student Id */}
            <div>
              <label className="block mb-1 text-gray-600 text-sm sm:text-base">
                Student ID
              </label>
              <input
                type="text"
                value={studentUsername}
                onChange={(e) => setStudentUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                placeholder="Enter your username"
                style={{color: 'white'}}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 text-gray-600 text-sm sm:text-base">
                Password
              </label>
              <input
                type="password"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 sm:py-3 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                placeholder="Enter your password"
                style={{color: 'white'}}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2.5 sm:py-3 rounded-lg font-medium hover:bg-teal-600 transition"
            >
              LOGIN
            </button>

            {/* Links */}
            <div className="flex justify-between text-xs sm:text-sm mt-3 text-gray-500">
              <a href="#" className="hover:text-gray-700">
                Forgot password?
              </a>
              <a href="/register" className="text-teal-600 hover:underline">
                Register here
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;