import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { fetchLocations } from '../api';

const Hero = ({ searchQuery, setSearchQuery, userLocation, setUserLocation }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        let isIgnored = false;

        const getSuggestions = async () => {
            if (!showSuggestions) return; // Only fetch if dropdown should be visible

            try {
                // If userLocation contains a comma (like "Trivandrum, Kerala"), search using only the city part
                let searchLoc = userLocation ? userLocation.split(',')[0].trim() : '';
                const result = await fetchLocations(searchLoc);
                
                if (!isIgnored) {
                    if (result && result.success) {
                        setSuggestions(result.data || []);
                    } else {
                        setSuggestions([]);
                    }
                }
            } catch (e) {
                if (!isIgnored) setSuggestions([]);
            }
        };


        const timer = setTimeout(getSuggestions, 150); // Faster response time for dropdown
        return () => {
            isIgnored = true;
            clearTimeout(timer);
        };
    }, [userLocation, showSuggestions]);

    const handleSuggestionClick = (place) => {          
        setUserLocation(place);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <section className="relative w-full h-[33rem] bg-secondary flex overflow-hidden ">
            <div className="absolute inset-0 bg-gradient-to-r from-secondary to-transparent z-10 opacity-90"></div>
            <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                alt="Banner" 
                className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[0.2]"
            />
            
            
            <div className="max-w-[1240px] mx-auto px-6 z-20 flex flex-col justify-center gap-6">
                <div className="animate-in slide-in-from-left duration-700">
                    <h1 className="text-white text-5xl font-black mb-2 tracking-tighter leading-tight drop-shadow-2xl">Discover. <span className="text-primary tracking-normal italic">Explore.</span><br/>Eat Local.</h1>
                    <p className="text-slate-300 text-md md:text-xl  font-medium max-w-lg mb-8 leading-relaxed">The ultimate food directory for kerala. Find the best restaurants, hidden gems, and local snacks all in one place.</p>
                </div>
                
                <div className="bg-white p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl max-w-4xl transition-all duration-300 hover:shadow-primary/10">
                    <div className="flex-1 relative flex items-center gap-3 px-4 py-3 border-r-0 md:border-r border-slate-100">
                        <MapPin size={24} className="text-primary" />
                        <input 
                            type="text"
                            value={userLocation}
                            onChange={(e) => {
                                setUserLocation(e.target.value);
                                setShowSuggestions(true); 
                            }}
                            onFocus={() => setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            className="bg-transparent border-none outline-none w-full text-text-dark font-bold placeholder:text-text-light"
                            placeholder="Set Location..."
                        />

                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                {suggestions.map((place, index) => (
                                    <div 
                                        key={index}
                                        onClick={() => handleSuggestionClick(place)}
                                        className="px-5 py-4 hover:bg-slate-50 cursor-pointer flex items-center gap-3 group transition-colors border-b border-slate-50 last:border-none"
                                    >
                                        <MapPin size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
                                        <span className="text-sm font-black text-secondary">{place}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex-[1.5] flex items-center gap-3 px-4 py-3">
                        <Search size={24} className="text-text-light" />
                        <input 
                            placeholder="Restaurant, cuisine, or a dish..." 
                            className="bg-transparent border-none outline-none w-full text-text-dark font-semibold text-lg placeholder:text-text-light"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button className="bg-primary hover:bg-emerald-600 text-white font-black text-lg px-10 py-4 transition-all duration-300 rounded-xl">
                        Search
                    </button>
                        
                </div>
            </div>
        </section>
    );
};

export default Hero;
