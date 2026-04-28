import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await api.post('/users/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const fetchRestaurants = async (search = '', location = '') => {
    try {
        const response = await api.get('/restaurants', {
            params: { search, location }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return { success: false, data: [] };
    }
};

export const fetchLocations = async (query = '') => {
    try {
        const response = await api.get('/restaurants/locations', {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching locations:', error);
        return { success: false, data: [] };
    }
};

export const fetchRestaurantById = async (id) => {
    try {
        const response = await api.get(`/restaurants/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurant details:', error);
        return null;
    }
};

export const fetchRestaurantReviews = async (restaurantId) => {
    try {
        const response = await api.get(`/reviews/${restaurantId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, data: [] };
    }
};

export const addReview = async (reviewData) => {
    try {
        const token = localStorage.getItem('token') || localStorage.getItem('admin_token');
        const response = await api.post('/reviews', reviewData, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        return response.data;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

export default api;
