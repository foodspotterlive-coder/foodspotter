import React, { useState, useEffect } from 'react';
import { Search, MapPin, User as UserIcon, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ searchQuery, setSearchQuery, userLocation }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="w-full bg-white border-b border-border sticky top-0 z-[1000] ">
            <div className="max-w-[1240px] mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-8 no-underline">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">F</div>
                        <span className="text-2xl font-black tracking-tight text-secondary">Food<span className="text-primary italic">Explore</span></span>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    {setSearchQuery && (
                        <div className="hidden lg:flex items-center border border-border rounded-lg bg-slate-50 px-4 py-2 w-72 h-11 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search size={18} className="text-text-light" />
                            <input 
                                type="text" 
                                placeholder="Find your favorite dish..." 
                                className="bg-transparent border-none outline-none ml-2 w-full text-sm text-text-dark font-medium placeholder:text-text-light"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                    <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-[10px] uppercase">
                                        {user.username.charAt(0)}
                                    </div>
                                    <span className="text-sm font-black text-secondary">{user.username}</span>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-text-light hover:text-red-500 transition-colors"
                                >
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="btn-premium flex items-center gap-2 !px-5 !py-2.5 no-underline">
                                <UserIcon size={18} />
                                <span>Sign in</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
