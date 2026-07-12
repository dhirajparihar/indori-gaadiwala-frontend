'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { vehiclesApi } from '@/lib/api';
import { Vehicle } from '@/lib/types';
import VehicleCard from '@/components/ui/VehicleCard';
import WelcomePopup from '@/components/WelcomePopup';
import { 
  FaCar, 
  FaMotorcycle, 
  FaCheckCircle, 
  FaRocket, 
  FaShieldAlt, 
  FaSearch, 
  FaMoneyBillWave, 
  FaFileAlt, 
  FaUmbrella, 
  FaPlus, 
  FaUsers, 
  FaAward, 
  FaFileContract,
  FaArrowRight,
  FaChevronDown,
  FaTruck,
  FaHeadphones
} from 'react-icons/fa';

export default function HomePage() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Panel States
  const [searchType, setSearchType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchFuel, setSearchFuel] = useState('');
  const [searchTransmission, setSearchTransmission] = useState('');

  useEffect(() => {
    loadFeaturedVehicles();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const response = await vehiclesApi.getAll();
      const allVehicles = response.data.data || [];
      const featured = allVehicles.filter((v: Vehicle) => v.featured);
      const displayVehicles = featured.length > 0
        ? featured.slice(0, 6)
        : allVehicles.slice(0, 6);
      setFeaturedVehicles(displayVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setFeaturedVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchType) params.set('type', searchType);
    if (searchBudget) params.set('maxPrice', searchBudget);
    if (searchFuel) params.set('fuelType', searchFuel);
    if (searchTransmission) params.set('transmission', searchTransmission);
    
    router.push(`/vehicles?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* Welcome Popup */}
      <WelcomePopup />

      {/* Hero Section */}
      <section className="hero relative border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hero-content">
          <div className="w-full lg:max-w-2xl ml-auto text-left flex flex-col items-start">
            
            {/* Small Badge */}
            <span className="bg-[#E5C158] text-[#111111] font-extrabold text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1.5 rounded-md mb-5 font-sans inline-block shadow-sm">
              Indori Gaadiwala
            </span>
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-[#111111] mb-6 tracking-tight font-display leading-[1.05] text-left">
              Buy, Sell &amp; Transfer <br />
              <span className="text-[#D4A63F]">Vehicles Made Easy</span>
            </h1>
            
            {/* Description */}
            <p className="text-gray-600 mb-8 max-w-xl text-base font-medium leading-relaxed font-sans text-left">
              From buying to financing, RTO paperwork to ownership transfer — you handle the steering. We handle everything else.
            </p>
            
            {/* Features Row (3 columns with dividers) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 mt-4 w-full max-w-xl border-t border-gray-100 pt-6">
              
              <div className="flex items-center space-x-3 pb-4 sm:pb-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-sm">
                  <FaShieldAlt />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#111111] font-sans">Trusted &amp; Secure</h4>
                  <p className="text-[10px] text-gray-500 font-sans">Verified vehicles &amp; safe transactions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 sm:pt-0 sm:pl-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-sm">
                  <FaFileContract />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#111111] font-sans">Hassle-Free Process</h4>
                  <p className="text-[10px] text-gray-500 font-sans">We handle all RTO paperwork</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 sm:pt-0 sm:pl-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-sm">
                  <FaHeadphones />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#111111] font-sans">Expert Support</h4>
                  <p className="text-[10px] text-gray-500 font-sans">Dedicated support at every step</p>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* Floating Dark Search Panel */}
      <div className="search-panel-container">
        <form onSubmit={handleSearch} className="search-panel">
          {/* Buy / Sell Mode buttons */}
          <div className="flex items-center space-x-3 mb-6">
            <button
              type="button"
              onClick={() => router.push('/vehicles')}
              className="border border-[#D4A63F] text-[#D4A63F] hover:bg-[#D4A63F]/10 transition-colors px-5 py-2 rounded-full flex items-center space-x-2 text-xs font-bold font-sans cursor-pointer"
            >
              <FaCar className="text-[#D4A63F]" />
              <span>Buy Vehicle</span>
            </button>
            <button
              type="button"
              onClick={() => router.push('/sell-vehicle')}
              className="border border-neutral-700 text-white hover:border-[#D4A63F]/50 transition-colors px-5 py-2 rounded-full flex items-center space-x-2 text-xs font-bold font-sans cursor-pointer"
            >
              <FaPlus className="text-gray-400" />
              <span>Sell Vehicle</span>
            </button>
          </div>

          {/* Core inputs filter panel */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            
            {/* Category Dropdown */}
            <div className="bg-[#2B2B2B]/40 border border-neutral-800 rounded-2xl px-4 py-2 flex flex-col text-left relative">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans">Select Category</span>
              <div className="relative">
                <select
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer mt-0.5 w-full appearance-none pr-6 font-sans"
                >
                  <option className="bg-[#18181B]" value="">All Categories</option>
                  <option className="bg-[#18181B]" value="car">Cars</option>
                  <option className="bg-[#18181B]" value="bike">Bikes</option>
                  <option className="bg-[#18181B]" value="commercial">Commercial</option>
                </select>
                <FaChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
              </div>
            </div>

            {/* Brand Dropdown */}
            <div className="bg-[#2B2B2B]/40 border border-neutral-800 rounded-2xl px-4 py-2 flex flex-col text-left relative">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans">Select Brand</span>
              <div className="relative">
                <select
                  value={searchFuel}
                  onChange={(e) => setSearchFuel(e.target.value)}
                  className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer mt-0.5 w-full appearance-none pr-6 font-sans"
                >
                  <option className="bg-[#18181B]" value="">All Brands</option>
                  <option className="bg-[#18181B]" value="Mahindra">Mahindra</option>
                  <option className="bg-[#18181B]" value="Maruti Suzuki">Maruti Suzuki</option>
                  <option className="bg-[#18181B]" value="Tata">Tata</option>
                  <option className="bg-[#18181B]" value="Hyundai">Hyundai</option>
                  <option className="bg-[#18181B]" value="Honda">Honda</option>
                  <option className="bg-[#18181B]" value="Toyota">Toyota</option>
                </select>
                <FaChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
              </div>
            </div>

            {/* Location Dropdown */}
            <div className="bg-[#2B2B2B]/40 border border-neutral-800 rounded-2xl px-4 py-2 flex flex-col text-left relative">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-sans">Select Location</span>
              <div className="relative flex items-center justify-between mt-0.5">
                <select
                  value={searchTransmission}
                  onChange={(e) => setSearchTransmission(e.target.value)}
                  className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer w-full appearance-none pr-10 font-sans"
                >
                  <option className="bg-[#18181B]" value="">All Locations</option>
                  <option className="bg-[#18181B]" value="Vijay Nagar">Vijay Nagar</option>
                  <option className="bg-[#18181B]" value="Bicholi Mardana">Bicholi Mardana</option>
                  <option className="bg-[#18181B]" value="Palasia">Palasia</option>
                  <option className="bg-[#18181B]" value="Rajendra Nagar">Rajendra Nagar</option>
                </select>
                <div className="flex items-center space-x-1.5 pointer-events-none absolute right-0 top-1/2 -translate-y-1/2">
                  <span className="text-gray-400 text-xs">📍</span>
                  <FaChevronDown className="text-gray-400 text-[10px]" />
                </div>
              </div>
            </div>

            {/* Search Submit Button */}
            <div>
              <button type="submit" className="btn-search w-full h-[52px] rounded-2xl flex items-center justify-center font-sans">
                <FaSearch className="text-sm" />
                <span>Search Vehicles</span>
              </button>
            </div>

          </div>
        </form>
      </div>

      {/* Statistics Section */}
      <section className="relative z-10 -mt-10 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-soft grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
          {[
            { icon: <FaCar />, value: '10,000+', label: 'Vehicles Sold' },
            { icon: <FaUsers />, value: '5,000+', label: 'Happy Customers' },
            { icon: <FaAward />, value: '15+', label: 'Years of Trust' },
            { icon: <FaFileContract />, value: '100%', label: 'RTO Compliant' }
          ].map((stat, idx) => (
            <div key={idx} className={`flex items-center space-x-4 pl-4 ${idx >= 2 ? 'pt-6 lg:pt-0' : ''} ${idx === 1 ? 'pt-6 sm:pt-0' : ''} ${idx === 0 ? 'pt-0' : ''}`}>
              <div className="w-12 h-12 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] flex items-center justify-center text-lg flex-shrink-0">
                {stat.icon}
              </div>
              <div className="text-left">
                <div className="text-xl sm:text-2xl font-black text-[#111111] font-display leading-tight">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 font-semibold font-sans">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-[#FAFAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">Curated Selection</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-2 tracking-tight font-display">
                Featured Showroom
              </h2>
              <p className="text-gray-500 font-medium text-base font-sans">Handpicked premium pre-owned vehicles in Indore</p>
            </div>
            <Link href="/vehicles" className="hidden md:flex items-center text-[#111111] font-bold hover:text-[#D4A63F] transition-colors font-sans text-sm gap-2">
              View All Vehicles <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A63F]"></div>
            </div>
          ) : featuredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle._id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400 py-20 font-medium font-sans">No premium vehicles listed at the moment.</p>
          )}

          <div className="mt-12 text-center md:hidden">
            <Link href="/vehicles" className="btn-primary w-full py-4.5 justify-center">
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">End-to-End Solutions</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 tracking-tight font-display">
              Premium Services
            </h2>
            <p className="text-base text-gray-500 max-w-2xl mx-auto font-medium font-sans">
              Complete peace of mind - from choosing your ride to financing, registration, and safety protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Finance */}
            <div className="group card p-8 border-[#E5E7EB] hover:border-[#D4A63F] transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4A63F]/10 text-[#D4A63F] rounded-full mb-6 group-hover:bg-[#D4A63F] group-hover:text-black transition-all duration-300">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3 tracking-tight font-display">Easy Finance</h3>
              <p className="text-gray-500 mb-6 leading-relaxed font-sans text-sm">
                Get quick loan approvals and flexible EMI options. Drive home your favorite vehicle with payment plans tailored for you.
              </p>
              <Link href="/services/finance" className="flex items-center text-[#111111] font-bold group-hover:text-[#D4A63F] transition-colors font-sans text-xs uppercase tracking-wider gap-1.5">
                <span>Learn More</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* RTO */}
            <div className="group card p-8 border-[#E5E7EB] hover:border-[#D4A63F] transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4A63F]/10 text-[#D4A63F] rounded-full mb-6 group-hover:bg-[#D4A63F] group-hover:text-black transition-all duration-300">
                <FaFileAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3 tracking-tight font-display">RTO Services</h3>
              <p className="text-gray-500 mb-6 leading-relaxed font-sans text-sm">
                Completely hassle-free registration and ownership transfer. We manage all RC transfer documents, NOC, and state clearances.
              </p>
              <Link href="/services/rto" className="flex items-center text-[#111111] font-bold group-hover:text-[#D4A63F] transition-colors font-sans text-xs uppercase tracking-wider gap-1.5">
                <span>Learn More</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Insurance */}
            <div className="group card p-8 border-[#E5E7EB] hover:border-[#D4A63F] transition-all duration-300">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4A63F]/10 text-[#D4A63F] rounded-full mb-6 group-hover:bg-[#D4A63F] group-hover:text-black transition-all duration-300">
                <FaUmbrella className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3 tracking-tight font-display">Insurance</h3>
              <p className="text-gray-500 mb-6 leading-relaxed font-sans text-sm">
                Get comprehensive vehicle protection at the most competitive rates. Secure your investments through our trusted insurance partners.
              </p>
              <Link href="/services/insurance" className="flex items-center text-[#111111] font-bold group-hover:text-[#D4A63F] transition-colors font-sans text-xs uppercase tracking-wider gap-1.5">
                <span>Learn More</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us (Feature Cards) */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">Why Indori Gaadiwala</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 tracking-tight font-display">
              The Luxury Experience
            </h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto font-medium font-sans">
              Setting new benchmarks for premium pre-owned automotive dealership in Central India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              { icon: '💰', title: 'Best Price Value', text: 'Get handpicked vehicles at transparent, standard pricing with up to 50% discount compared to brand new models.' },
              { icon: <FaCheckCircle />, title: 'Rigorous Verification', text: 'Every car, SUV and motorcycle passes through a rigid multi-point checklist inspecting mechanics, electricals, and frame integrity.' },
              { icon: <FaRocket />, title: 'Expedited Handover', text: 'No long waits. Buy your vehicle, and get delivery, quick EMI approvals and paper submissions within minimal working hours.' },
              { icon: <FaShieldAlt />, title: 'Uncompromising Trust', text: 'Clear documents, authentic odometers, legal assurance, and seamless ownership transfer directly under official RTO channels.' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start space-x-5 p-4 rounded-2xl hover:bg-[#FAFAF8] transition-colors duration-300">
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-2xl">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111] mb-2 font-display">{feature.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed font-sans">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111111] rounded-[24px] p-8 md:p-14 text-center text-white relative overflow-hidden group shadow-medium border border-neutral-800">
            {/* Golden radial background glow */}
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-[#D4A63F]/10 rounded-full blur-3xl group-hover:bg-[#D4A63F]/20 transition-all duration-700" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight font-display">
                Ready to Find Your Premium Ride?
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed font-sans">
                Browse our extensive digital showroom of premium cars, SUVs, and bikes. Get pre-approved loan status and details in minutes.
              </p>
              <Link href="/vehicles" className="inline-flex items-center justify-center bg-[#D4A63F] text-black font-extrabold py-4 px-10 rounded-full hover:bg-[#C6942C] hover:scale-105 transition-all shadow-md font-sans text-sm gap-2">
                <span>Start Browsing Showroom</span>
                <FaArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
