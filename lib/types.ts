export interface Vehicle {
    _id: string;
    title: string;
    type: 'car' | 'bike' | 'commercial';
    brand: string;
    model: string;
    year: number;
    price: number;
    originalPrice: number;
    discount: number;
    mileage: string;
    kmDriven?: number;
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
    transmission: 'Manual' | 'Automatic' | 'Semi-Automatic';
    description: string;
    images: string[];
    features: string[];
    status: 'available' | 'sold' | 'reserved';
    ownerCount?: number;
    location?: string;
    featured?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Booking {
    _id: string;
    vehicle: Vehicle | string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    message?: string;
    offeredPrice?: number;
    status: 'pending' | 'contacted' | 'completed' | 'cancelled';
    preferredContactTime?: string;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'admin' | 'superadmin';
}
