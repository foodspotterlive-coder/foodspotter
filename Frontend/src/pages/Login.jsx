import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, Sparkles, ChefHat, Mail } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await loginUser(credentials);
            if (result.success) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                navigate('/');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-bg-light font-inter">
            <Navbar />
            <div className="flex items-center justify-center py-20 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md p-8 bg-white rounded-[2.5rem] shadow-premium border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <div className="text-center mb-10">
                        <div className="w-16 h-16  bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <ChefHat size={32} className="text-primary" />
                        </div>
                        <h1 className="text-3xl font-black text-secondary tracking-tight">Welcome Back</h1>
                        <p className="text-text-medium font-bold text-sm mt-2">Continue your culinary exploration</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-light uppercase tracking-widest ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="text" 
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                                    placeholder="your_username"
                                    value={credentials.username}
                                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-text-light uppercase tracking-widest ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light group-focus-within:text-primary transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm"
                                    placeholder="••••••••"
                                    value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-secondary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-sm font-bold text-text-medium">
                        New Explorer? <Link to="/register" className="text-primary hover:underline">Create an Account</Link>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
