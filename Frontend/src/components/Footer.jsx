import React from 'react';
import { Facebook, Twitter, Instagram, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-secondary text-white pt-24 pb-12 border-t border-slate-800">
            <div className="max-w-[1240px] mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl">F</div>
                            <span className="text-2xl font-black tracking-tight text-white">Food<span className="text-primary italic">Explore</span></span>
                        </div>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
                         Kochi's original food explorer. Discovering the finest tastes across the city since 2026.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <div key={i} className="w-10 h-10 bg-white/5 hover:bg-primary rounded-full flex items-center justify-center cursor-pointer transition-all duration-300">
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">Discover</h4>
                        <ul className="flex flex-col gap-4">
                            {['Top Rated', 'Near Kochi', 'Hidden Gems', 'Local Snacks', 'Cafes'].map((item) => (
                                <li key={item} className="text-slate-400 text-sm font-bold hover:text-white cursor-pointer transition-colors transition-transform duration-300 hover:translate-x-1">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">Partnership</h4>
                        <ul className="flex flex-col gap-4">
                            {['List Your Place', 'Partner with us', 'Ride with us', 'Ride for us', 'Merchant FAQ'].map((item) => (
                                <li key={item} className="text-slate-400 text-sm font-bold hover:text-white cursor-pointer transition-colors transition-transform duration-300 hover:translate-x-1">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    <div>
                        <h4 className="text-lg font-black mb-6 uppercase tracking-widest text-primary">News & Updates</h4>
                        <p className="text-slate-400 text-sm font-medium mb-6">Stay hungry for more updates.</p>
                        <div className="bg-white/5 border border-white/10 p-2 rounded-2xl flex items-center">
                            <input 
                                placeholder="Get notified..." 
                                className="bg-transparent border-none outline-none w-full px-4 text-xs font-bold text-white placeholder:text-slate-500"
                            />
                            <button className="bg-primary hover:bg-emerald-600 p-3 rounded-xl transition-all shadow-lg active:scale-90 shadow-primary/20">
                                <Mail size={18} />
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="h-px w-full bg-white/10 mb-10"></div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                        © 2026 Food Explore - All rights reserved.
                    </div>
                    <div className="flex gap-10">
                        {['Terms', 'Privacy', 'Security', 'Sitemap'].map((item) => (
                            <span key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary cursor-pointer transition-colors">
                                {item}
                            </span>
                        ))}
                    </div>
                    <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="bg-white/5 hover:bg-white/10 p-4 rounded-full transition-all group border border-white/5"
                    >
                        <ArrowUp size={20} className="text-slate-400 group-hover:text-primary animate-bounce" />
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
