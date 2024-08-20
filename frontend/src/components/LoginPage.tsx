import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from '../apis/authService';
import AxiosError from '../interfaces/AxiosError';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const loginfun = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(email, password);
            if (response && response.data) {
                localStorage.clear();
                localStorage.setItem('email', response.data.user.email);
                localStorage.setItem('userId', response.data.user.userId);
                toast.success("Login successful");
                navigate("/create-database");
            }
        } catch (error) {
            console.error("Login failed", error);
            const axiosError = error as AxiosError;
            const errorMessage = axiosError.response?.data?.message || "Login unsuccessful, Invalid Username/Password";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={loginfun} className="max-w-md mx-auto mt-12 bg-gray-100 p-8 border border-gray-300 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">Login</h2>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-600 text-sm font-medium mb-2">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    required
                />
            </div>
            <div className="mb-6">
                <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 mb-8"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className={`w-full mb-3 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
            >
                {loading ? 'Login...' : 'Login'}
            </button>
            <p className="text-center text-gray-600 text-sm mt-5">
                Not registered?{' '}
                <Link to="/" className="text-blue-500 hover:text-blue-700">
                    Sign up here
                </Link>
            </p>
        </form >
    )
}