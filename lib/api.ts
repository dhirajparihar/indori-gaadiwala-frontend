import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Vehicles API
export const vehiclesApi = {
    getAll: (params?: Record<string, unknown>) => api.get('/vehicles', { params }),
    getById: (id: string) => api.get(`/vehicles/${id}`),
    create: (data: FormData) => api.post('/vehicles', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id: string, data: Record<string, unknown> | FormData) => api.put(`/vehicles/${id}`, data),
    delete: (id: string) => api.delete(`/vehicles/${id}`),
};

// Bookings API
export const bookingsApi = {
    create: (data: Record<string, unknown>) => api.post('/bookings', data),
    getAll: (params?: Record<string, unknown>) => api.get('/bookings', { params }),
    getById: (id: string) => api.get(`/bookings/${id}`),
    update: (id: string, data: Record<string, unknown>) => api.put(`/bookings/${id}`, data),
    delete: (id: string) => api.delete(`/bookings/${id}`),
};

// Auth API
export const authApi = {
    login: (credentials: { email: string; password: string }) =>
        api.post('/auth/login', credentials),
    verify: () => api.get('/auth/verify'),
    register: (data: Record<string, unknown>) => api.post('/auth/register', data),
};

// Leads API
export const leadsApi = {
    create: (data: { name: string; phone: string }) =>
        api.post('/leads', data),
    getAll: () => api.get('/leads'),
    update: (id: string, data: Record<string, unknown>) => api.put(`/leads/${id}`, data),
    delete: (id: string) => api.delete(`/leads/${id}`),
};

// Seller Inquiries API
export const sellerInquiriesApi = {
    create: (data: FormData) => api.post('/seller-inquiries', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getAll: () => api.get('/seller-inquiries'),
    getById: (id: string) => api.get(`/seller-inquiries/${id}`),
    update: (id: string, data: Record<string, unknown>) => api.put(`/seller-inquiries/${id}`, data),
    delete: (id: string) => api.delete(`/seller-inquiries/${id}`),
    lookupByRegNo: (regNo: string) => api.get(`/seller-inquiries/lookup/${regNo}`),
    publicLookupByRegNo: (regNo: string) => api.get(`/seller-inquiries/public-lookup/${regNo}`),
};

// Helper to get image URL
export const getImageUrl = (path: string) => {
    if (!path) return '/placeholder-car.jpg';
    if (path.startsWith('http')) return path;
    return `http://localhost:5000${path}`;
};

// Format price
export const formatPrice = (price: number) => {
    return '₹' + price.toLocaleString('en-IN');
};

