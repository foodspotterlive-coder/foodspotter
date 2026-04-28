import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, Sparkles, ChefHat } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from '../Utilis.js/axios';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/admins/login', credentials);

            if (response.data.success) {
                localStorage.setItem('admin_auth', 'true');
                localStorage.setItem('admin_token', response.data.token);
                localStorage.setItem('admin_user', JSON.stringify(response.data.user));

                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert(err.response?.data?.message || 'Login failed! Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-[#161f33]">
            {/* Background Animations */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>


            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md p-6 sm:p-10 glass-card relative z-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl mx-4"
            >   
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                        <ChefHat size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-2">
                        Food Explorer <span className="text-primary">Admin</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm italic">Authorized Access Only</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                            value={credentials.username}
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2  text-gray-500 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary transition-all"
                            value={credentials.password}
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            required
                            
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-lg transition-all shadow-lg shadow-primary/20 cursor-pointer"
                    >
                        {loading ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                                <Sparkles size={24} />
                            </motion.div>
                        ) : (
                            <>
                                Authenticate <LogIn size={20} />
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}; 

export default Login;
