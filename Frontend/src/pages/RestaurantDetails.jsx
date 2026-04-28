import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRestaurantById, fetchRestaurantReviews, addReview } from '../api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Star, MapPin, IndianRupee, Clock, Calendar, ChefHat, ArrowLeft, Send, MessageSquare, Compass, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix for Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('details');

    const formatVideoUrl = (url) => {
        if (!url) return '';
        let formattedUrl = url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            formattedUrl = 'https://' + url;
        }

        try {
            if (formattedUrl.includes('youtube.com/shorts/')) {
                const videoId = formattedUrl.split('youtube.com/shorts/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (formattedUrl.includes('youtube.com/watch')) {
                const urlObj = new URL(formattedUrl);
                const videoId = urlObj.searchParams.get('v');
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (formattedUrl.includes('youtu.be/')) {
                const videoId = formattedUrl.split('youtu.be/')[1].split('?')[0];
                return `https://www.youtube.com/embed/${videoId}`;
            }
        } catch (err) {
            console.error("Error formatting URL:", err);
        }
        return formattedUrl;
    };

    // New Review State
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        const getDetails = async () => {
            const result = await fetchRestaurantById(id);
            if (result && result.success) {
                setRestaurant(result.data);
                // Fetch reviews
                const reviewsResult = await fetchRestaurantReviews(id);
                if (reviewsResult && reviewsResult.success) {
                    setReviews(reviewsResult.data);
                }
            }
            setLoading(false);
        };
        getDetails();
        window.scrollTo(0, 0);
    }, [id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
        if (!token) {
            alert('Please login to submit a review');
            return;
        }

        setSubmitting(true);
        try {
            const result = await addReview({
                restaurantId: id,
                ...newReview
            });

            if (result.success) {
                setReviews([result.data, ...reviews]);
                setNewReview({ rating: 5, comment: '' });
                // Refresh restaurant details for updated average rating
                const updatedRes = await fetchRestaurantById(id);
                if (updatedRes.success) setRestaurant(updatedRes.data);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit review');
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-light flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="min-h-screen bg-bg-light flex flex-col items-center justify-center p-6 text-center">
                <h2 className="text-4xl font-black text-secondary mb-4">Restaurant Not Found</h2>
                <p className="text-text-medium font-bold mb-8">The culinary spot you're looking for doesn't seem to exist.</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-premium flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back to Exploration
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-light font-inter">
            <Navbar userLocation="Exploration Mode" />

            <main className="max-w-[1240px] mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-3 text-text-light font-black text-xs uppercase tracking-widest mb-8 hover:text-primary transition-colors"
                >
                    <div className="p-2 bg-white rounded-xl shadow-premium group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowLeft size={16} />
                    </div>
                    <span>Back to Explore</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content Side */}
                    <div className="lg:col-span-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-[2.5rem] shadow-premium overflow-hidden mb-12"
                        >
                            <div className="relative h-96 overflow-hidden">
                                <img
                                    src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&auto=format&fit=crop'}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-2 shadow-xl border border-white/20">
                                            <Star size={16} className="text-primary fill-primary" />
                                            <span className="font-black text-secondary">{restaurant.rating || '4.5'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 md:p-12">
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                                    <div>
                                        <span className="text-primary text-xs font-black uppercase tracking-[0.2em] mb-2 block">Premium Discovery</span>
                                        <h1 className="text-5xl font-black text-secondary tracking-tighter mb-4">{restaurant.name}</h1>
                                        <div className="flex items-center gap-2 text-text-medium font-bold">
                                            <MapPin size={18} className="text-primary" />
                                            <span>{restaurant.place}, {restaurant.landmark}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-1">
                                        <p className="text-4xl font-black text-primary italic">₹{restaurant.averagePrice}</p>
                                        <p className="text-[10px] font-black text-text-light uppercase tracking-widest">Average Cost for Two</p>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b border-slate-100 mb-10">
                                    <button
                                        onClick={() => setActiveTab('details')}
                                        className={`px-8 py-4 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === 'details' ? 'text-primary' : 'text-text-medium hover:text-secondary'}`}
                                    >
                                        The Experience
                                        {activeTab === 'details' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('reviews')}
                                        className={`px-8 py-4 text-xs font-black uppercase tracking-[0.15em] transition-all relative ${activeTab === 'reviews' ? 'text-primary' : 'text-text-medium hover:text-secondary'}`}
                                    >
                                        Reviews & Ratings
                                        {activeTab === 'reviews' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />}
                                    </button>
                                </div>

                                {activeTab === 'details' ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-12"
                                    >
                                        <div>
                                            <h3 className="text-xl font-black text-secondary mb-6 flex items-center gap-3">
                                                <ChefHat className="text-primary" size={24} />
                                                Signature Highlights
                                            </h3>
                                            <p className="text-lg font-bold text-text-medium leading-relaxed italic border-l-4 border-slate-100 pl-8 py-2">
                                                "{restaurant.famousRecipe}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                                <Clock className="text-primary mb-4" size={28} />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Operational Hours</p>
                                                <p className="text-secondary font-black text-lg">{restaurant.time || '10:00 AM'}</p>
                                                <p className="text-text-medium text-xs font-bold mt-1 flex items-center gap-1.5">   ``````````````
                                                    <Calendar size={14} /> {restaurant.operatingDays || 'All Week Open'}
                                                </p>
                                            </div>

                                            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                                                <MapPin className="text-primary mb-4" size={28} />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-text-light mb-1">Precise Location</p>
                                                <p className="text-secondary font-black text-lg">{restaurant.place}</p>
                                                <p className="text-text-medium text-xs font-bold mt-1">{restaurant.landmark}</p>
                                            </div>
                                        </div>

                                        {restaurant.location && restaurant.location.coordinates && (
                                            <div className="mt-12">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-xl font-black text-secondary flex items-center gap-3">
                                                        <Compass className="text-primary" size={24} />
                                                        Location
                                                    </h3>
                                                    <a
                                                        href={`https://www.google.com/maps/search/?api=1&query=${restaurant.location.coordinates[1]},${restaurant.location.coordinates[0]}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2"
                                                    >
                                                        <ExternalLink size={12} className="text-primary" /> Open in Maps
                                                    </a>
                                                </div>
                                                
                                            </div>
                                        )}

                                        {restaurant.videoUrl && (
                                            <div className="mt-12">
                                                <h3 className="text-xl font-black text-secondary mb-6 flex items-center gap-3">
                                                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
                                                    </div>
                                                    Video
                                                </h3>
                                                <div className="relative rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg bg-black aspect-video w-full max-w-4xl mx-auto">
                                                    <iframe
                                                        src={formatVideoUrl(restaurant.videoUrl)}
                                                        className="absolute top-0 left-0 w-full h-full border-0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        title="Restaurant Reel"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xl font-black text-secondary">Community Reviews ({reviews.length})</h3>
                                        </div>

                                        {/* Add Review Form */}
                                        <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 mb-12">
                                            <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-6">Leave a Review</h4>
                                            <form onSubmit={handleReviewSubmit} className="space-y-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black text-text-medium uppercase tracking-widest">Rating:</span>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                                className={`p-1 transition-all ${newReview.rating >= star ? 'text-amber-500 scale-110' : 'text-slate-300 hover:text-amber-300'}`}
                                                            >
                                                                <Star size={20} fill={newReview.rating >= star ? 'currentColor' : 'none'} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    required
                                                    value={newReview.comment}
                                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                                    placeholder="Share your experience at this culinary spot..."
                                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm min-h-[120px]"
                                                />
                                                <button
                                                    disabled={submitting}
                                                    type="submit"
                                                    className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                                >
                                                    {submitting ? 'Posting...' : <><Send size={16} /> Post Review</>}
                                                </button>
                                            </form>
                                        </div>

                                        {/* Real Reviews List */}
                                        {reviews.length > 0 ? (
                                            reviews.map((rev) => (
                                                <div key={rev.id} className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black uppercase">
                                                                {(rev.admin?.username || rev.user?.username || 'E').charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black text-secondary capitalize">
                                                                    {rev.admin?.username || rev.user?.username || 'Explorer'}
                                                                </p>
                                                                <p className="text-[10px] font-bold text-text-light uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-amber-500">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < rev.rating ? 'currentColor' : 'none'} className={i < rev.rating ? '' : 'opacity-20'} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-text-medium font-bold text-sm leading-relaxed">
                                                        {rev.comment}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <MessageSquare size={24} className="text-text-light" />
                                                </div>
                                                <p className="text-text-medium font-bold text-sm">No reviews yet. Be the first to explore and share!</p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Side */}
                    <div className="lg:col-span-4 space-y-8">                      
                        <div className="p-8 bg-white rounded-[2.5rem] shadow-premium border border-slate-100">
                            <h4 className="text-sm font-black text-secondary uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">Social Highlights</h4>
                            <div className="flex flex-wrap gap-2">
                                {['FoodExplorerChoice', 'TopRated', 'FreshIngredients', 'MustVisit'].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-slate-50 text-text-medium rounded-xl text-[10px] font-black uppercase tracking-wider">#{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default RestaurantDetails;
