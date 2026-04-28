import { Star, Clock, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => {
    const { id, name, rating, famousRecipe, averagePrice, place, imageUrl, time } = restaurant;
    
    const img = imageUrl || `https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop`;

    return (
        <div className="group relative w-full h-[32rem] p-3 transition-all duration-300 transform hover:-translate-y-2">
            <div className="w-full h-full relative rounded-[2rem] overflow-hidden shadow-premium group-hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] bg-white border border-slate-100">
                <div className="h-2/3 w-full relative overflow-hidden">
                    <img 
                        src={img} 
                        alt={name} 
                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4 bg-white/95 text-secondary rounded-full font-black text-xs px-3 py-1 uppercase tracking-wider backdrop-blur-md shadow-lg border border-slate-100 flex items-center justify-center gap-2">
                        <Star size={12} className="text-primary fill-primary"/>
                        <span>{rating || '4.0'}</span>
                    </div>
                </div>
                
                <div className="h-1/3 p-6 flex flex-col justify-between">
                    <div>
                        <h3 className="text-xl font-black text-secondary group-hover:text-primary transition-colors leading-tight mb-1">{name}</h3>
                        <p className="text-text-medium text-xs font-bold leading-relaxed line-clamp-2">{famousRecipe}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5 text-xs font-black tracking-wide text-text-light uppercase opacity-80">
                                <MapPin size={12} className="text-primary"/>
                                <span>{place}</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <p className="text-lg font-black text-primary italic leading-none">₹{averagePrice}</p>
                            <p className="text-[10px] font-black text-text-light uppercase tracking-widest leading-none opacity-60">Avg Cost</p>
                        </div> 
                    </div>
                    
                    <Link 
                        to={`/restaurant/${id}`}
                        className="absolute -bottom-10 group-hover:bottom-0 left-0 right-0 h-10 bg-primary flex items-center justify-center text-white font-black text-[10px] uppercase tracking-widest transition-all duration-500 transform scale-x-0 group-hover:scale-x-100 origin-center cursor-pointer hover:bg-emerald-600 border-none w-full no-underline"
                    >
                        View Details & Menu
                    </Link> 
                </div>
            </div>
        </div>
    );
};

export default RestaurantCard;
