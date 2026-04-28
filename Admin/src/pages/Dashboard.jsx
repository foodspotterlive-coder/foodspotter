import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, MapPin, IndianRupee, Clock, ExternalLink, ChefHat, Filter, RefreshCw, LogOut, X, Send, Menu, User } from 'lucide-react';
import axios from '../Utilis.js/axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const Dashboard = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [stats, setStats] = useState({ avgPrice: 0, activeCount: 0 });
    const [isDev, setIsDev] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [editRestaurant, setEditRestaurant] = useState(null);
    const [newRestaurant, setNewRestaurant] = useState({
        name: '',
        place: '',
        landmark: '',
        famousRecipe: '',
        averagePrice: '',
        operatingDays: '',
        paymentTypes: 'Cash, UPI',
        imageUrl: '',
        videoUrl: '',
        rating: 4.5,
        time: '',
        lat: '',
        lng: '',
    });
    // const [editUser, setEditUser] = useState(null);
    // const [newUser, setNewUser] = useState({
    //     name: '',
    //     email: '',
    //     role: 'User'
    // });
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (restaurants.length > 0) {
            const avg = restaurants.reduce((sum, r) => sum + (Number(r.averagePrice) || 0), 0) / restaurants.length;
            const active = restaurants.filter(r => r.status !== 'inactive').length;
            setStats({ avgPrice: Math.round(avg), activeCount: active });
        } else {
            setStats({ avgPrice: 0, activeCount: 0 });
        }
    }, [restaurants]);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.get('/restaurants', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (response.data && response.data.data) {
                setRestaurants(response.data.data);
            } else {
                setRestaurants([]);
            }
            setIsDev(false);
        } catch (err) {
            console.error("Backend error fetching restaurants:", err);
            setIsDev(true);
            setRestaurants([]);
        }
        setLoading(false);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('admin_token');
            const payload = {
                ...newRestaurant,
                averagePrice: Number(newRestaurant.averagePrice),
                paymentTypes: Array.isArray(newRestaurant.paymentTypes)
                    ? newRestaurant.paymentTypes
                    : newRestaurant.paymentTypes.split(',').map(s => s.trim()),
                rating: Number(newRestaurant.rating),
                time: newRestaurant.time,
                location: newRestaurant.lat && newRestaurant.lng ? {
                    type: 'Point',
                    coordinates: [parseFloat(newRestaurant.lng), parseFloat(newRestaurant.lat)]
                } : null
            };

            let response;
            if (editRestaurant) {
                response = await axios.put(`/restaurants/${editRestaurant.id}`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                response = await axios.post('/restaurants', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (response.data.success) {
                setIsModalOpen(false);
                setEditRestaurant(null);
                setNewRestaurant({
                    name: '', place: '', landmark: '', famousRecipe: '',
                    averagePrice: '', operatingDays: '', paymentTypes: 'Cash, UPI',
                    imageUrl: '', videoUrl: '', rating: 4.5, time: '',
                    lat: '', lng: ''
                });
                fetchRestaurants();
            }
        } catch (err) {
            console.error("Error submitting restaurant:", err);
            alert(err.response?.data?.message || "Failed to save restaurant");
        }
        setLoading(false);
    };


    const handleEdit = (rest) => {
        setEditRestaurant(rest);
        setNewRestaurant({
            name: rest.name,
            place: rest.place,
            landmark: rest.landmark,
            famousRecipe: rest.famousRecipe,
            averagePrice: rest.averagePrice,
            operatingDays: rest.operatingDays,
            paymentTypes: Array.isArray(rest.paymentTypes) ? rest.paymentTypes.join(', ') : rest.paymentTypes,
            imageUrl: rest.imageUrl || '',
            videoUrl: rest.videoUrl || '',
            rating: rest.rating || 4.5,
            time: rest.time,
            lat: rest.location?.coordinates?.[1] || '',
            lng: rest.location?.coordinates?.[0] || '',
        });
        setIsModalOpen(true);
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
        try {
            const token = localStorage.getItem('admin_token');
            await axios.delete(`/restaurants/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRestaurants(prev => prev.filter(r => r.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete restaurant");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        navigate('/');
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const token = localStorage.getItem('admin_token');
            const response = await axios.post('/upload', formData, {
                headers: {  
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });

            if (response.data && response.data.imageUrl) {
                // Prepend base URL for serving
                const fullUrl = `http://localhost:3000${response.data.imageUrl}`;
                setNewRestaurant(prev => ({ ...prev, imageUrl: fullUrl }));
            }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Failed to upload image. Only images under 5MB are allowed.");
        }
        setLoading(false);
    };



    const filtered = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.place.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="flex min-h-screen bg-[#0f172a] text-white">
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1e293b] border-b border-white/10 z-[50] flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-primary rounded-lg">
                        <ChefHat size={18} />
                    </div>
                    <h2 className="text-lg font-black tracking-tight">FoodExplorer</h2>
                </div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar Overlay (Mobile only) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-[70] w-[260px] border-r border-white/10 flex flex-col p-6 bg-[#1e293b] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:static
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/30">
                            <ChefHat size={24} />
                        </div>
                        <h2 className="text-xl font-black">FoodExplorer <span className="text-primary">Admin</span></h2>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 ml-4 mb-5 hover:bg-white/5 rounded-lg"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-0 space-y-2 mb-6">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary/10 text-primary rounded-xl font-semibold text-left">
                        <RefreshCw size={18} /> Dashboard
                    </button>
                </nav>
                <div className="space-y-4 mb-6">
                    <button
                        onClick={() => {
                            setEditRestaurant(null);
                            setNewRestaurant({
                                name: '', place: '', landmark: '', famousRecipe: '',
                                averagePrice: '', operatingDays: '', paymentTypes: 'Cash, UPI',
                                imageUrl: '', videoUrl: '', rating: 4.5, time: '',
                                lat: '', lng: ''
                            });
                            setIsModalOpen(true);
                        }}
                        className="hover:bg-red-500/10 text-red-500  flex items-center justify-center gap-2 py-4 px-4 rounded-2xl w-full sm:w-auto shadow-lg  cursor-pointer"
                    >
                        <Plus size={20} /> Add New Restaurant
                    </button>
                </div>


                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-all"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 overflow-x-hidden pt-16 lg:pt-0">
                <div className="p-4 md:p-10 max-w-[1600px] mx-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
                    {/* Page Header */}
                    <header className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-6 mb-10 mt-4 md:mt-0">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black mb-2">Restaurant Management</h1>
                            <p className="text-gray-400">Total Restaurants: <span className="text-white font-bold">{restaurants.length}</span></p>
                        </div>
                    </header>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                        <div className="glass-card p-6 border-l-4 border-primary">
                            <p className="text-xs text-gray-500 uppercase font-black mb-1">Active Now</p>
                            <h3 className="text-3xl font-black">{stats.activeCount}</h3>
                        </div>
                    </div>

                    {/* Table Section */}
                    <div className="glass-card overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="relative w-full md:w-[300px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search restaurants..."
                                    className="input-field pl-10 h-[42px] text-sm w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            {isDev && (
                                <span className="text-[10px] text-orange-400 px-3 py-1 bg-orange-400/10 border border-orange-400/20 rounded-full font-black uppercase tracking-widest text-center">
                                    Live: False (Demo Mode)
                                </span>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left min-w-[800px]">
                                <thead className="text-[10px] text-gray-500 uppercase font-bold tracking-widest bg-white/5">
                                    <tr>
                                        <th className="px-6 py-4">Restaurant</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Famous Recipe</th>
                                        <th className="px-6 py-4">Avg Price</th>
                                        <th className="px-6 py-4">Opening Time</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    <AnimatePresence>
                                        {filtered.map((rest, i) => (
                                            <motion.tr
                                                key={rest.id || i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="table-row group"
                                            >
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                                                            <img
                                                                src={rest.imageUrl || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop'}
                                                                alt={rest.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&auto=format&fit=crop' }}
                                                            />
                                                        </div>
                                                        <span className="font-bold">{rest.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin size={14} className="text-primary flex-shrink-0" /> {rest.place}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-semibold whitespace-nowrap">
                                                        {rest.famousRecipe}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 font-black text-sm">₹ {rest.averagePrice}</td>
                                                <td className="px-6 py-5 text-gray-400">
                                                    <div className="flex items-center gap-2">
                                                        <Clock size={14} className="text-primary flex-shrink-0" /> {rest.time || 'N/A'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${rest.status === 'inactive' ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></div>
                                                        <span className="text-xs font-medium capitalize">{rest.status || 'Active'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(rest)}
                                                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                                            title="Edit Restaurant"
                                                        >
                                                            <Edit3 size={16} />
                                                        </button>
                                                 
                                                        <button
                                                            onClick={() => handleDelete(rest.id)}
                                                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                                            title="Delete Restaurant"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Restaurant Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => {
                                setIsModalOpen(false);
                                setEditRestaurant(null);
                            }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        ></motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                                <div>
                                    <h3 className="text-2xl font-black">{editRestaurant ? 'Edit Restaurant' : 'Add New Restaurant'}</h3>
                                    <p className="text-gray-400 text-sm">
                                        {editRestaurant ? `Updating details for ${editRestaurant.name}` : 'Enter the details of the new culinary spot'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditRestaurant(null);
                                    }}
                                    className="p-2 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAddSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Restaurant Name</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field w-full"
                                            placeholder="e.g. Ocean Blue"
                                            value={newRestaurant.name}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Location / Place</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field w-full"
                                            placeholder="e.g. Downtown"
                                            value={newRestaurant.place}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, place: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Landmark</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field w-full"
                                            placeholder="e.g. Near City Mall"
                                            value={newRestaurant.landmark}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, landmark: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Famous Recipe</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field w-full"
                                            placeholder="e.g. Dynamite Shrimp"
                                            value={newRestaurant.famousRecipe}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, famousRecipe: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Avg Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field w-full"
                                            placeholder="e.g. 1200"
                                            value={newRestaurant.averagePrice}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, averagePrice: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Time</label>
                                        <input
                                            type='time'
                                            required
                                            className='input-field w-full'
                                            placeholder=''
                                            value={newRestaurant.time}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, time: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Operating Days</label>
                                        <input
                                            type="text"
                                            required
                                            className="input-field w-full"
                                            placeholder="e.g. Mon - Sat"
                                            value={newRestaurant.operatingDays}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, operatingDays: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Payment Types (Comma-separated)</label>
                                        <input
                                            type="text"
                                            className="input-field w-full"
                                            placeholder="e.g. Cash, UPI, Card"
                                            value={newRestaurant.paymentTypes}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, paymentTypes: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Rating (1-5)</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="1"
                                            max="5"
                                            className="input-field w-full"
                                            value={newRestaurant.rating}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, rating: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Latitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            className="input-field w-full text-xs"
                                            placeholder="e.g. 10.4567"
                                            value={newRestaurant.lat}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, lat: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Longitude</label>
                                        <input
                                            type="number"
                                            step="any"
                                            className="input-field w-full text-xs"
                                            placeholder="e.g. 76.1234"
                                            value={newRestaurant.lng}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, lng: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Upload New Image</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileUpload}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="w-full h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-2 group-hover:bg-white/10 transition-all border-dashed">
                                                    <Plus size={16} className="text-primary" />
                                                    <span className="text-xs font-bold text-gray-400">Choose Local Image</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Or Paste Image URL</label>
                                            <input
                                                type="text"
                                                className="input-field w-full h-11 text-xs"
                                                placeholder="https://..."
                                                value={newRestaurant.imageUrl}
                                                onChange={(e) => setNewRestaurant({ ...newRestaurant, imageUrl: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Paste Video/Reel URL (Optional)</label>
                                        <input
                                            type="text"
                                            className="input-field w-full h-11 text-xs"
                                            placeholder="https://... (mp4, webm, or valid video URL)"
                                            value={newRestaurant.videoUrl}
                                            onChange={(e) => setNewRestaurant({ ...newRestaurant, videoUrl: e.target.value })}
                                        />
                                    </div>

                                    {newRestaurant.imageUrl && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="w-full h-40 rounded-2xl overflow-hidden border border-white/10"
                                        >
                                            <img
                                                src={newRestaurant.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                        </motion.div>
                                    )}
                                </div>

                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 font-bold transition-all border border-white/5"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-[2] btn-primary flex items-center justify-center gap-2 text-lg"
                                    >
                                        {loading ? <RefreshCw className="animate-spin" /> : (
                                            <>
                                                <Send size={20} />
                                                {editRestaurant ? 'Update Details' : 'Add Restaurant'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>  
    );
};

export default Dashboard;
