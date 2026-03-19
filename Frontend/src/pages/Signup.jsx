import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import signupImg from '../Assest/signup.svg';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ThemeToggle from '../components/ThemeToggle';
// Add these imports at top
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
// Add inside component
const navigate = useNavigate();
  // Update handleSubmit
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    // Check passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
  
    try {
      setLoading(true);
  
      const response = await API.post("/auth/signup", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
  
      if (response.data.success) {
        toast.success("Account created successfully! 🎉");
        login(response.data.user, response.data.token);
        navigate("/chat");
      }
  
    } catch (err) {
     toast.error(err.response?.data?.message || "Signup failed!");
      setError(err.response?.data?.message || "Signup failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='w-full min-h-screen flex font-sans bg-light-bg dark:bg-dark-bg'>
      <div className="fixed top-4 right-4 z-10">
        <ThemeToggle />
      </div>
  
      {/* Left side — hidden on mobile */}
      <div className='hidden md:flex w-1/2 flex-col justify-center px-16 bg-indigo-50 dark:bg-dark-sidebar'>
        <h2 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">Create Account.</h2>
        <p className="text-light-subtext dark:text-dark-subtext mb-8">Sign up to get started.</p>
        <img src={signupImg} alt="signup" className="mt-8 w-full max-w-md mx-auto" />
      </div>
  
      {/* Right side — full width on mobile, half on desktop */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 bg-light-bg dark:bg-dark-bg">
  
        {/* Mobile only heading */}
        <div className="md:hidden mb-8 text-center">
          <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-1">Create Account.</h2>
          <p className="text-light-subtext dark:text-dark-subtext text-sm">Sign up to get started.</p>
        </div>
  
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
  
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder='First Name'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary border border-light-border dark:border-dark-border"
            />
            <input
              type="text"
              placeholder='Last Name'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary border border-light-border dark:border-dark-border"
            />
          </div>
  
          <input
            type="email"
            placeholder='Email'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full mb-4 bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary border border-light-border dark:border-dark-border"
          />
  
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder='Password'
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary border border-light-border dark:border-dark-border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-light-subtext hover:text-light-text transition"
            >
              {showPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>
  
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full bg-light-input dark:bg-dark-input text-light-text dark:text-dark-text placeholder-light-subtext dark:placeholder-dark-subtext rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary border border-light-border dark:border-dark-border"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-light-subtext hover:text-light-text transition"
            >
              {showConfirmPassword ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
            </button>
          </div>
  
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
  
        <p className="text-light-subtext text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:text-primary-hover">
            Log In
          </Link>
        </p>
      </div>
    </div>
  )
};

export default Signup;