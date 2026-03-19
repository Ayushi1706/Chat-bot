import React, { useState } from 'react'
import loginImg from '../Assest/login.svg'
import { Link } from 'react-router-dom'
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import ThemeToggle from "../components/ThemeToggle";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

 const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email:"",
        password:""
    });
    const navigate = useNavigate();
    const [error, setError] = useState(""); // eslint-disable-line no-unused-vars
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const handleSubmit =  async (e) => {
        e.preventDefault();
        setError("");
        try{
          setLoading(true);
          const response = await API.post("/auth/login", {
            email: formData.email,
            password: formData.password
          });
  
          if(response.data.success){
            toast.success("Welcome back! 👋");
            login(response.data.user, response.data.token);
            navigate("/chat");
          }
        }catch (err) {
          toast.error(err.response?.data?.message || "Login failed!");
          setError(err.response?.data?.message || "Login failed!");
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
            <h2 className="text-4xl font-bold text-light-text dark:text-dark-text mb-2">Welcome back.</h2>
            <p className="text-light-subtext dark:text-dark-subtext mb-8">Let's sign you in.</p>
            <img src={loginImg} alt="" />
          </div>
      
          {/* Right side — full width on mobile, half on desktop */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 bg-light-bg dark:bg-dark-bg">
            
            {/* Mobile only heading */}
            <div className="md:hidden mb-8 text-center">
              <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-1">Welcome back.</h2>
              <p className="text-light-subtext dark:text-dark-subtext text-sm">Let's sign you in.</p>
            </div>
      
            <form onSubmit={handleSubmit}>
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
      
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Continue"}
              </button>
            </form>
      
            <p className="text-light-subtext text-sm mt-4">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-medium hover:text-primary-hover">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      )
}
export default Login;
