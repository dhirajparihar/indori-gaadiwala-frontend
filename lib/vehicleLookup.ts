import axios from 'axios';

export interface VehicleLookupDetails {
    make: string;
    model: string;
    variant: string;
    variantDisplayName: string;
    year: string;
    regnYear: string;
    color: string;
    bodyType: string;
    fuelType: string;
    rawFuelType: string;
    transmissionType: string;
    registeredPlace: string;
    registeredAt: string;
    vehicleCategory: string;
    vehicleClassDesc: string;
    rcModel: string;
    rcStatus: string;
    rcOwnerCount: string;
    rcOwnerNameMasked: string;
    insuranceCompany: string;
    insuranceUpTo: string;
    fitnessUpTo: string;
    pucUpTo: string;
    taxUpTo: string;
    hypothecation: boolean;
    financier: string;
    rtoNocIssued: string;
    manufacturingMonthYr: string;
    unladenWt: string;
    seatCap: string;
}

export const fetchVehicleDetails = async (regNo: string): Promise<VehicleLookupDetails | null> => {
    try {
        const carUrl = process.env.CAR_URL;
        const carApiKey = process.env.CAR_API_KEY;

        if (!carUrl || !carApiKey) {
            console.error('CAR_URL or CAR_API_KEY is not defined in environment variables');
            return null;
        }

        const response = await axios.get(
            `${carUrl}/${regNo}`,
            {
                timeout: 15000,
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'authorization': `Basic ${carApiKey}`,
                    'device_category': 'WebApp',
                    'origin': 'https://www.cars24.com',
                    'origin_source': 'c2b-website',
                    'platform': 'seller',
                    'referer': 'https://www.cars24.com/',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
                }
            }
        );

        if (response.data && response.data.success && response.data.detail) {
            const d = response.data.detail;
            const variant = d.ds_details?.[0]?.variant || {};

            return {
                // Basic Info
                make: d.brand?.make_display || '',
                model: d.model?.model_display || '',
                variant: variant.variant_name || '',
                variantDisplayName: variant.variant_display_name || '',
                year: d.year?.year || '',
                regnYear: d.regn_year || '',
                color: d.color || '',
                bodyType: d.model?.bodyType || '',

                // Fuel & Transmission
                fuelType: variant.fuel_type || d.fuelType || '',
                rawFuelType: d.rawFuelType || '',
                transmissionType: variant.transmission_type || '',

                // Registration Details
                registeredPlace: d.registeredPlace || '',
                registeredAt: d.registeredAt || '',
                vehicleCategory: d.vehicleCategory || '',
                vehicleClassDesc: d.vehicleClassDesc || '',
                rcModel: d.rc_model || '',
                rcStatus: d.rcStatus || '',
                rcOwnerCount: d.rc_owner_sr || '',
                rcOwnerNameMasked: d.rc_owner_name_masked || '',

                // Insurance & Fitness
                insuranceCompany: d.insuranceCompany || '',
                insuranceUpTo: d.insuranceUpTo || '',
                fitnessUpTo: d.fitnessUpTo || '',
                pucUpTo: d.pucUpTo || '',
                taxUpTo: d.taxUpTo || '',

                // Finance
                hypothecation: d.hypothecation || false,
                financier: d.financier || '',
                rtoNocIssued: d.rtoNocIssued || '',

                // Manufacturing
                manufacturingMonthYr: d.manufacturingMonthYr || '',
                unladenWt: d.unladenWt || '',
                seatCap: d.seatCap || ''
            };
        }
        return null;
    } catch (error: any) {
        console.error('Error fetching vehicle details:', error.message);
        return null;
    }
};
