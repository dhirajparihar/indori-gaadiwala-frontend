/**
 * Validation utility functions for consistent error handling across the application
 */

export class ValidationError extends Error {
    constructor(message: string, public statusCode: number = 400) {
        super(message);
        this.name = 'ValidationError';
    }
}

export const validators = {
    // Email validation
    email: (email: string): void => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            throw new ValidationError('Please provide a valid email address');
        }
    },

    // Phone number validation (Indian format: 10 digits starting with 6-9)
    phone: (phone: string): void => {
        const phonePattern = /^[6-9]\d{9}$/;
        if (!phonePattern.test(phone)) {
            throw new ValidationError('Please enter a valid 10-digit phone number starting with 6, 7, 8, or 9');
        }
    },

    // Name validation (minimum length)
    name: (name: string, minLength: number = 2): void => {
        if (!name || name.trim().length < minLength) {
            throw new ValidationError(`Name must be at least ${minLength} characters`);
        }
    },

    // Password validation (minimum length)
    password: (password: string, minLength: number = 6): void => {
        if (!password || password.length < minLength) {
            throw new ValidationError(`Password must be at least ${minLength} characters`);
        }
    },

    // Registration number validation (Indian format)
    regNo: (regNo: string): void => {
        const formattedRegNo = regNo.toUpperCase().replace(/\s+/g, '');
        const regNoPattern = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;
        if (!regNoPattern.test(formattedRegNo)) {
            throw new ValidationError('Please enter a valid registration number (e.g., MP09CD1234)');
        }
    },

    // Year validation (reasonable range)
    year: (year: number): void => {
        const currentYear = new Date().getFullYear();
        if (year < 1990 || year > currentYear + 1) {
            throw new ValidationError(`Year must be between 1990 and ${currentYear + 1}`);
        }
    },

    // Price validation (reasonable range)
    price: (price: number, min: number = 10000, max: number = 100000000): void => {
        if (price < min || price > max) {
            throw new ValidationError(`Price must be between ₹${min.toLocaleString()} and ₹${max.toLocaleString()}`);
        }
    },

    // Mileage validation (km/l)
    mileage: (mileage: string): void => {
        const mileageNum = parseFloat(mileage);
        if (isNaN(mileageNum) || mileageNum < 0 || mileageNum > 100) {
            throw new ValidationError('Mileage must be between 0 and 100 km/l');
        }
    },

    // Owner count validation
    ownerCount: (count: number): void => {
        if (count < 1 || count > 5) {
            throw new ValidationError('Owner count must be between 1 and 5');
        }
    },

    // KM driven validation
    kmDriven: (km: number): void => {
        if (km < 0 || km > 500000) {
            throw new ValidationError('KM driven must be between 0 and 500000');
        }
    },

    // Rating validation (1-5)
    rating: (rating: number): void => {
        if (rating < 1 || rating > 5) {
            throw new ValidationError('Rating must be between 1 and 5');
        }
    },

    // Required field validation
    required: (value: any, fieldName: string): void => {
        if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
            throw new ValidationError(`${fieldName} is required`);
        }
    },

    // Minimum length validation
    minLength: (value: string, minLength: number, fieldName: string): void => {
        if (!value || value.trim().length < minLength) {
            throw new ValidationError(`${fieldName} must be at least ${minLength} characters`);
        }
    }
};

/**
 * Helper function to handle validation errors in API routes
 */
export const handleValidationError = (error: unknown) => {
    if (error instanceof ValidationError) {
        return {
            success: false,
            message: error.message,
            statusCode: error.statusCode
        };
    }
    return {
        success: false,
        message: error instanceof Error ? error.message : 'Validation failed',
        statusCode: 400
    };
};
