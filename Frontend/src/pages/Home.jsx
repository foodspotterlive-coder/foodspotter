import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import RestaurantGrid from '../components/RestaurantGrid';
import Footer from '../components/Footer';

const Home = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [userLocation, setUserLocation] = useState('');
    
    return (
        <div className="min-h-screen bg-bg-light font-inter selection:bg-primary/20 selection:text-primary">
            <Navbar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                userLocation={userLocation}
            />
            <main className="overflow-hidden">
                <Hero 
                    searchQuery={searchQuery} 
                    setSearchQuery={setSearchQuery} 
                    userLocation={userLocation}
                    setUserLocation={setUserLocation}
                />
                <div className="relative">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>
                    
                    <RestaurantGrid 
                        searchQuery={searchQuery} 
                        activeFilter={activeFilter}
                        setActiveFilter={setActiveFilter}
                        searchLocation={userLocation}
                    />
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
