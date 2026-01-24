'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { vehiclesApi } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/ui/VehicleCard';
import WelcomePopup from '@/components/WelcomePopup';
import { FaCar, FaMotorcycle, FaCheckCircle, FaRocket, FaShieldAlt, FaSearch, FaMoneyBillWave, FaFileAlt, FaUmbrella, FaPlus } from 'react-icons/fa';

export default function HomePage() {
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedVehicles();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      console.log('Loading vehicles for homepage...');
      const response = await vehiclesApi.getAll();
      console.log('API Response:', response);

      const allVehicles = response.data.data || [];
      console.log('Total vehicles found:', allVehicles.length);

      // Filter featured vehicles
      const featured = allVehicles.filter((v: Vehicle) => v.featured);
      console.log('Featured vehicles:', featured.length);

      // Show featured vehicles if any, otherwise show all
      const displayVehicles = featured.length > 0
        ? featured.slice(0, 6)
        : allVehicles.slice(0, 6);

      console.log('Displaying vehicles:', displayVehicles.length);
      setFeaturedVehicles(displayVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setFeaturedVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Welcome Popup */}
      <WelcomePopup />

      {/* Hero Section */}
      <section className="hero">
        {/* Hero Content */}
        <div className="hero-content">
          <div className="flex flex-col items-end justify-center">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-orange-500 mb-4 whitespace-nowrap drop-shadow-md">
              Indori Gaadiwala
            </h2>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 mb-6 drop-shadow-sm">
              Buy, Sell & Transfer Vehicles Made Easy
            </h1>
            <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl font-medium">
              From buying to financing, RTO paperwork to ownership transfer — You handle the steering. We handle everything else.
            </p>
            <div className="hero-buttons !justify-end flex flex-wrap gap-3">
              <Link href="/vehicles?type=car" className="btn-primary inline-flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                <FaCar />
                <span>Browse Cars</span>
              </Link>
              <Link href="/vehicles?type=bike" className="btn-secondary inline-flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                <FaMotorcycle />
                <span>Browse Bikes</span>
              </Link>
              <Link href="/vehicles?type=commercial" className="btn-dark inline-flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                <FaSearch />
                <span>Commercial</span>
              </Link>
              <Link href="/sell-vehicle" className="btn-red inline-flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                <FaPlus />
                <span>Sell Vehicle</span>
              </Link>
              <Link href="/vehicles" className="btn-outline inline-flex items-center justify-center space-x-2 text-base shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                <FaSearch />
                <span>View All</span>
              </Link>
            </div>
          </div>
        </div>


      </section>

      {/* Featured Vehicles */}
      <section className="py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
                Featured <span className="text-blue-600">Vehicles</span>
              </h2>
              <p className="text-gray-500 font-medium text-lg">Handpicked premium selection for you</p>
            </div>
            <Link href="/vehicles" className="hidden md:flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
              View All Vehicles <span className="ml-1.5 focus:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-20 font-medium">No vehicles available yet.</p>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/vehicles" className="btn-primary w-full inline-flex items-center justify-center">
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>
      {/* Our Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Our <span className="text-blue-600">Services</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-medium">
              Complete vehicle solutions - from purchase to registration and protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Finance */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Easy Finance</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Easy EMI options and quick loan approvals. Get your dream vehicle with flexible payment plans.
              </p>
              <Link href="/services/finance" className="flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
                <span>Learn More</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* RTO */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 text-blue-600 rounded-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <FaFileAlt className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">RTO Services</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Hassle-free registration and transfer. We handle all RC transfer, NOC, and paperwork.
              </p>
              <Link href="/services/rto" className="flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
                <span>Learn More</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            {/* Insurance */}
            <div className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-blue-100 transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-50 text-orange-600 rounded-xl mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
                <FaUmbrella className="text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">Insurance</h3>
              <p className="text-gray-500 mb-6 leading-relaxed">
                Comprehensive coverage at best rates. Protect your vehicle with our trusted partners.
              </p>
              <Link href="/services/insurance" className="flex items-center text-blue-600 font-bold hover:text-blue-700 transition-colors">
                <span>Learn More</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-[#F3F4F6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              Why Choose <span className="text-blue-600">Us</span>?
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium">
              We make buying used vehicles simple, safe, and affordable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: '💰', title: 'Best Prices', text: 'Get up to 50% off on premium quality vehicles.' },
              { icon: <FaCheckCircle />, title: 'Verified', text: 'Every vehicle is thoroughly inspected for quality.' },
              { icon: <FaRocket />, title: 'Quick Process', text: 'Contact us and get your vehicle in no time!' },
              { icon: <FaShieldAlt />, title: 'Trusted', text: 'Transparent pricing and genuine paperwork.' },
            ].map((feature, i) => (
              <div key={i} className="text-center flex flex-col items-center">
                <div className="flex items-center justify-center w-14 h-14 bg-white text-blue-600 rounded-2xl shadow-sm mb-5 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
                Ready to Find Your Perfect Vehicle?
              </h2>
              <p className="text-blue-50 mb-8 max-w-lg mx-auto font-medium">
                Browse our extensive collection of cars and bikes at amazing prices.
              </p>
              <Link href="/vehicles" className="inline-flex items-center justify-center bg-white text-blue-600 font-bold py-4 px-10 rounded-xl hover:scale-105 transition-all shadow-lg hover:shadow-white/20">
                Start Browsing Now <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
