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

export interface Lead {
    _id: string;
    name: string;
    phone: string;
    vehicleId?: string; // or vehicle object
    status: 'new' | 'contacted' | 'converted' | 'lost';
    notes?: string;
    createdAt: string;
}

export interface SellerInquiry {
    _id: string;
    name: string;
    phone: string;
    regNo: string;
    kmDriven: number;
    demand: number;
    type?: 'car' | 'bike' | 'commercial';
    status: 'new' | 'contacted' | 'completed' | 'rejected' | 'inspection_scheduled' | 'purchased';
    notes?: string;
    createdAt: string;
    updatedAt?: string;

    // RTO / Vehicle Details
    make?: string;
    model?: string;
    variant?: string;
    year?: string;
    fuelType?: string;
    transmissionType?: string;
    bodyType?: string;
    registeredPlace?: string;
    registeredAt?: string;
    rcStatus?: string;
    rcOwnerCount?: string;
    rcOwnerNameMasked?: string;
    insuranceCompany?: string;
    insuranceUpTo?: string;
    fitnessUpTo?: string;
    taxUpTo?: string;
    pucUpTo?: string;
    manufacturingMonthYr?: string;
    color?: string;
    seatCap?: string;
    vehicleCategory?: string;
    hypothecation?: boolean;
    financier?: string;

    // Images
    photos?: string[];
    // For compatibility with frontend component expecting 'photo' string
    photo?: string;
    rcCard?: string;

    vehicleDetails?: any;
}
