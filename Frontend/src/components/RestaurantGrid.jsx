import React, { useEffect, useState } from 'react';
import { fetchRestaurants } from '../api';
import RestaurantCard from './RestaurantCard';
import { Filter, ChevronRight, SlidersHorizontal, GridIcon } from 'lucide-react';

const RestaurantGrid = ({ searchQuery, activeFilter, setActiveFilter, searchLocation }) => {
    const [originalRestaurants, setOriginalRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isIgnored = false;

        const getRestaurants = async () => {
            setLoading(true);
            try {
                // Extracts the main city name from "City, State"
                const location = searchLocation ? searchLocation.split(',')[0].trim() : '';
                const result = await fetchRestaurants(searchQuery, location);
                
                if (!isIgnored) {
                    if (result && result.success) {
                        setOriginalRestaurants(result.data || []);
                    } else {
                        setOriginalRestaurants([]);
                    }
                }
            } catch (err) {
                if (!isIgnored) setOriginalRestaurants([]);
            } finally {
                if (!isIgnored) setLoading(false);
            }
        };
        
        // Debounce search by 300ms
        const timeout = setTimeout(getRestaurants, 300);
        
        return () => {
            isIgnored = true;
            clearTimeout(timeout);
        };
    }, [searchQuery, searchLocation]);

    // UI-only Tag Filter Logic
    const filteredRestaurants = originalRestaurants.filter(res => {
        const matchesFilter = activeFilter === 'All' || 
            (res.category && res.category.toLowerCase() === activeFilter.toLowerCase()) ||
            res.famousRecipe.toLowerCase().includes(activeFilter.toLowerCase()) ||
            res.name.toLowerCase().includes(activeFilter.toLowerCase());

        return matchesFilter;
    });

    if (loading) {
        return (
            <div className="py-20 max-w-[1240px] mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="h-[28rem] bg-gradient-to-br from-slate-100 to-slate-200 animate-pulse rounded-[2rem]"></div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <section className="py-20 max-w-[1240px] mx-auto px-6 " id="explore" >
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div className="animate-in slide-in-from-bottom duration-500">
                    <div className="flex items-center gap-3 text-primary text-xs font-black uppercase tracking-widest mb-1">
                        <GridIcon size={16} />
                        <span>Featured Explorer</span>
                    </div>
                    <h2 className="text-4xl font-black text-secondary tracking-tighter leading-tight drop-shadow-sm">Top Rated In {searchLocation.split(',')[0]}</h2>
                    <p className="text-text-medium font-bold text-sm max-w-sm mt-3 leading-relaxed">Hand-picked selection of the most consistent and quality food spots across the city.</p>
                </div>
                
                <div className="flex items-center gap-4 animate-in slide-in-from-right duration-500">
                    <div className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-premium cursor-pointer hover:border-primary transition-all duration-300 group">
                        <SlidersHorizontal size={20} className="text-primary group-hover:rotate-180 transition-transform duration-500" />
                        <span className="text-sm font-black text-secondary uppercase tracking-wider">Filters</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        {['All', 'Premium', 'Street', 'Cafe'].map((tag) => (
                            <button  
                                key={tag} 
                                onClick={() => setActiveFilter(tag)}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 active:scale-95 translate-y-0 hover:-translate-y-1 ${
                                    activeFilter === tag 
                                    ? 'bg-white text-primary shadow-md' 
                                    : 'text-text-medium hover:text-primary hover:bg-white'
                                }`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ">
                {filteredRestaurants.length > 0 ? (
                    filteredRestaurants.map((res) => (
                        <RestaurantCard 
                            key={res.id} 
                            restaurant={res} 
                        />
                    ))
                ) : (
                    <div className="col-span-full py-40 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 opacity-40">
                            <Filter size={48} className="text-text-medium" />
                        </div>
                        <h4 className="text-2xl font-black text-secondary mb-2 tracking-tighter">No Restaurants Found</h4>
                        <p className="text-text-medium font-bold text-sm max-w-sm">Sorry, we couldn't find any results for your search criteria. Try broadening your location.</p>
                        <button 
                            onClick={() => { setActiveFilter('All'); }}
                            className="btn-premium mt-8 !px-10 !py-4 shadow-primary/20"
                        >
                            Reset All Filters
                        </button>
                        
                    </div>
                )}
            </div>
            
            {/* <div className="mt-20 flex justify-center">
                <button className="px-10 py-5 bg-secondary text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:tracking-[0.3em] hover:bg-slate-800 shadow-xl flex items-center gap-3">
                    🚀 Load More Gems
                </button>
          
            </div> */}

        </section>
    );
};

export default RestaurantGrid;
