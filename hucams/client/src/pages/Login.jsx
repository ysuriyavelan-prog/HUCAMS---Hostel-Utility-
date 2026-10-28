import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { setAuth } from '../utils/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, user } = response.data;

            setAuth(token, user);

            // Redirect based on role
            if (user.role === 'ADMIN') {
                navigate('/dashboard');
            } else if (user.role === 'STUDENT') {
                navigate('/student/usage');
            } else {
                navigate('/analytics');
            }
        } catch (err) {
            console.error("Login failed", err);
            if (!err?.response) {
                setError('Network Error: Unable to reach server. Is the backend running?');
            } else {
                setError(err.response?.data?.error || 'Login failed. Please check credentials.');
            }
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80')` }}>

            {/* Overlay */}
            <div className="absolute inset-0 bg-blue-900/60 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-md p-4">
                <div className="bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 overflow-hidden transform transition-all hover:scale-[1.01] duration-300">

                    {/* Header */}
                    <div className="px-8 pt-8 pb-6 text-center">
                        <div className="w-16 h-16 bg-blue-500/80 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                            <span className="text-3xl font-bold text-white">H</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-blue-100/80 text-sm">Hostel Utility Consumption Analytics & Monitoring System</p>
                    </div>

                    {/* Form */}
                    <div className="px-8 pb-8">
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-50 animate-pulse">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider ml-1">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-blue-200/50"
                                    placeholder="name@hucams.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-blue-100 uppercase tracking-wider ml-1">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all text-white placeholder-blue-200/50"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/40 transform transition-all active:scale-[0.98] duration-200 flex items-center justify-center gap-2 mt-4"
                            >
                                <span>Sign In to Dashboard</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <div className="inline-block px-4 py-2 bg-black/20 backdrop-blur-md rounded-full border border-white/5 text-xs text-blue-200/80">
                        <span className="font-semibold text-blue-200">Demo:</span>
                        <span className="mx-2">Admin (admin@hucams.com / admin123)</span>
                        <span>•</span>
                        <span className="mx-2">Student (student@hucams.com / student123)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
