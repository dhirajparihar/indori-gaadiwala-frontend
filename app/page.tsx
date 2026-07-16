'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { vehiclesApi, happyCustomersApi, getOptimizedImageUrl } from '@/lib/api';
import { Vehicle, HappyCustomer } from '@/lib/types';
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
  FaHeadphones,
  FaWrench,
  FaStar,
  FaChevronLeft
} from 'react-icons/fa';

const DEFAULT_HAPPY_CUSTOMERS = [
  {
    _id: 'default-1',
    name: 'Rahul & Priya Dwivedi',
    vehicleName: 'Mahindra Thar (2024)',
    imageUrl: '/customer-1.png',
    review: 'Had an absolutely seamless buying experience. The team at Indori Gaadiwala helped us find the perfect Thar for our weekend trips, managed the RTO transfer within 2 days, and even arranged a door-step delivery!',
    rating: 5,
    deliveryDate: 'June 2026'
  },
  {
    _id: 'default-2',
    name: 'Sandeep Vyas & Family',
    vehicleName: 'Maruti Suzuki Baleno (2023)',
    imageUrl: '/customer-2.png',
    review: 'Buying a pre-owned car can be scary, but their 140+ point inspection report gave us total confidence. The car looks and drives like brand new. Highly recommended for families seeking honest prices!',
    rating: 5,
    deliveryDate: 'May 2026'
  },
  {
    _id: 'default-3',
    name: 'Amanpreet Singh',
    vehicleName: 'Royal Enfield Himalayan (2024)',
    imageUrl: '/customer-3.png',
    review: 'Amazing deal on a premium adventure bike. The staff is highly knowledgeable and passionate about motorcycles. The documentation was quick, and the price was unbeatable in Indore!',
    rating: 5,
    deliveryDate: 'April 2026'
  },
  {
    _id: 'default-4',
    name: 'Vikramaditya Solanki',
    vehicleName: 'Honda City Zx (2023)',
    imageUrl: '/customer-4.png',
    review: 'Superb customer service! The luxury handover ceremony was a pleasant surprise. The team is extremely professional and their RTO support is outstanding. Will definitely buy again.',
    rating: 5,
    deliveryDate: 'March 2026'
  }
];


function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(percentage);
      
      setCount(Math.floor(easedProgress * end));

      if (progress < duration) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration, isVisible]);

  return <span ref={counterRef}>{count.toLocaleString('en-IN')}{suffix}</span>;
}

export default function HomePage() {
  const router = useRouter();
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [happyCustomers, setHappyCustomers] = useState<HappyCustomer[]>([]);
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Search Panel States
  const [searchType, setSearchType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchFuel, setSearchFuel] = useState('');
  const [searchTransmission, setSearchTransmission] = useState('');

  useEffect(() => {
    loadFeaturedVehicles();
    loadHappyCustomers();
  }, []);

  const loadFeaturedVehicles = async () => {
    try {
      const fields = 'title,price,originalPrice,discount,images,year,fuelType,transmission,mileage,type,status';
      // First try to fetch only featured vehicles, up to 6
      const response = await vehiclesApi.getAll({ featured: 'true', limit: 6, fields });
      let displayVehicles = response.data.data || [];
      
      // Fallback: if no featured vehicles exist, fetch first 6 available vehicles
      if (displayVehicles.length === 0) {
        const fallbackResponse = await vehiclesApi.getAll({ limit: 6, fields });
        displayVehicles = fallbackResponse.data.data || [];
      }
      
      setFeaturedVehicles(displayVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      setFeaturedVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const loadHappyCustomers = async () => {
    try {
      const response = await happyCustomersApi.getAll();
      setHappyCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error loading happy customers:', error);
    }
  };

  const displayCustomers = happyCustomers.length > 0 ? happyCustomers : DEFAULT_HAPPY_CUSTOMERS;

  // Auto-swipe effect for happy customers carousel
  useEffect(() => {
    if (displayCustomers.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentCustomerIndex((prev) => (prev + 1) % displayCustomers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [displayCustomers.length]);

  const activeCustomer = displayCustomers[currentCustomerIndex];

  const handlePrevCustomer = () => {
    setCurrentCustomerIndex((prev) => (prev - 1 + displayCustomers.length) % displayCustomers.length);
  };

  const handleNextCustomer = () => {
    setCurrentCustomerIndex((prev) => (prev + 1) % displayCustomers.length);
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
        {/* Background Image using Next.js Image */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <Image
            src="/hero-thar.png"
            alt="Hero Background"
            fill
            priority
            quality={85}
            className="object-cover object-[25%_center] sm:object-left-center"
            sizes="100vw"
          />
          {/* Desktop Gradient Overlay (Left to Right) */}
          <div className="absolute inset-0 md:block hidden" style={{ background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.85) 55%, #FFFFFF 75%)' }} />
          {/* Mobile Gradient Overlay (Top to Bottom) */}
          <div className="absolute inset-0 md:hidden block" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.95) 65%, #FFFFFF 100%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hero-content relative z-10">
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

      {/* Featured Vehicles */}
      <section className="pt-28 pb-24 bg-[#FAFAF8]">
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

      {/* Pre-Purchase Inspection Banner Section */}
      <section className="py-16 bg-[#FAFAF8] border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#111111] rounded-[32px] p-8 md:p-12 text-white relative overflow-hidden group shadow-medium border border-neutral-800 flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Golden radial background glow */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4A63F]/10 rounded-full blur-3xl group-hover:bg-[#D4A63F]/15 transition-all duration-700 pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl text-left">
              <span className="bg-[#D4A63F] text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-md mb-4 inline-block font-sans">
                New Service
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mb-4 tracking-tight font-display leading-tight">
                Buying a Used Car elsewhere in Indore? <br />
                <span className="text-[#D4A63F]">Get it Inspected First!</span>
              </h2>
              <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed font-sans font-medium">
                Don't buy a lemon. Our certified mechanics will conduct a comprehensive 140+ point check (including paint depth, OBD engine diagnostics, and RTO history checks) at the seller's doorstep.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 text-xs text-gray-300 font-semibold font-sans mb-2">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-[#D4A63F] shrink-0" />
                  <span>140+ Point Checklist</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-[#D4A63F] shrink-0" />
                  <span>Doorstep Evaluation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-[#D4A63F] shrink-0" />
                  <span>Instant PDF Report</span>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 shrink-0 w-full lg:w-auto">
              <Link 
                href="/services/inspection" 
                className="inline-flex items-center justify-center w-full lg:w-auto bg-[#D4A63F] text-black font-extrabold py-4.5 px-8 rounded-full hover:bg-[#C6942C] hover:scale-103 transition-all duration-300 shadow-md font-sans text-sm gap-2 uppercase tracking-wider"
              >
                <FaWrench className="text-xs" />
                <span>Book Inspection Now</span>
                <FaArrowRight size={10} className="ml-1" />
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

      {/* Happy Customers Photo Show & Relocated Stats Section */}
      <section className="py-24 bg-[#FAFAF8] border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Relocated Statistics Bar */}
          <div className="mb-20 -mt-10 sm:-mt-16 relative z-10">
            <div className="bg-white border border-[#E5E7EB] rounded-[24px] p-6 sm:p-8 shadow-soft grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
              {[
                { icon: <FaCar />, end: 1000, suffix: '+', label: 'Vehicles Sold' },
                { icon: <FaUsers />, end: 1000, suffix: '+', label: 'Happy Customers' },
                { icon: <FaAward />, end: 7, suffix: '+', label: 'Years of Trust' },
                { icon: <FaFileContract />, end: 100, suffix: '%', label: 'RTO Compliant' }
              ].map((stat, idx) => (
                <div key={idx} className={`flex items-center space-x-4 pl-4 ${idx >= 2 ? 'pt-6 lg:pt-0' : ''} ${idx === 1 ? 'pt-6 sm:pt-0' : ''} ${idx === 0 ? 'pt-0' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] flex items-center justify-center text-lg flex-shrink-0">
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-xl sm:text-2xl font-black text-[#111111] font-display leading-tight">
                      <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-gray-500 font-semibold font-sans">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 text-left">
            <div>
              <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">Delivering Smiles</span>
              <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-2 tracking-tight font-display text-left">
                Happy Customers Photo Show
              </h2>
              <p className="text-gray-500 font-medium text-base font-sans">Real delivery moments from Indori Gaadiwala</p>
            </div>
            <button 
              onClick={() => setIsLightboxOpen(true)}
              className="flex items-center text-[#111111] hover:text-[#D4A63F] transition-colors font-bold font-sans text-sm gap-2 mt-6 md:mt-0 px-6 py-3 bg-white border border-gray-200 rounded-full shadow-sm cursor-pointer hover:shadow"
            >
              Show All Photos ({displayCustomers.length}) <FaArrowRight className="text-xs" />
            </button>
          </div>

          {/* Carousel */}
          {activeCustomer && (
            <div className="relative max-w-4xl mx-auto">
              <div 
                key={currentCustomerIndex} 
                className="bg-white border border-[#E5E7EB] rounded-[32px] shadow-medium overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[420px] animate-fade-in"
              >
                
                {/* Photo Column */}
                <div className="md:col-span-7 h-64 md:h-auto relative overflow-hidden group bg-gray-100">
                  <Image 
                    src={getOptimizedImageUrl(activeCustomer.imageUrl, 800, 500)} 
                    alt={activeCustomer.name} 
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-4 left-4 bg-[#D4A63F] text-black font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-md font-sans shadow-md z-10">
                    🎉 Delivered
                  </div>
                </div>

                {/* Testimonial details Column */}
                <div className="md:col-span-5 p-8 sm:p-10 flex flex-col justify-between text-left relative bg-white">
                  <div>
                    <div className="flex text-amber-500 gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} className={i < activeCustomer.rating ? 'fill-amber-500' : 'text-gray-200'} />
                      ))}
                    </div>

                    <h3 className="text-2xl font-black text-[#111111] font-display mb-1.5 leading-tight tracking-tight text-left">
                      {activeCustomer.name}
                    </h3>
                    <div className="inline-flex items-center gap-1.5 text-[10px] text-[#D4A63F] font-bold uppercase tracking-wider mb-6 bg-[#D4A63F]/10 px-2.5 py-1 rounded-md font-sans">
                      <FaCar size={10} />
                      <span>{activeCustomer.vehicleName}</span>
                    </div>

                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans font-medium italic">
                      "{activeCustomer.review}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-6 mt-6">
                    <div>
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider font-sans block">Delivery Date</span>
                      <span className="text-xs text-gray-800 font-bold font-sans">{activeCustomer.deliveryDate || 'N/A'}</span>
                    </div>

                    {/* Navigation */}
                    {displayCustomers.length > 1 && (
                      <div className="flex gap-2">
                        <button 
                          onClick={handlePrevCustomer}
                          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
                          aria-label="Previous customer"
                        >
                          <FaChevronLeft size={12} />
                        </button>
                        <button 
                          onClick={handleNextCustomer}
                          className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all cursor-pointer"
                          aria-label="Next customer"
                        >
                          <FaArrowRight size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Indicator Dots */}
              {displayCustomers.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {displayCustomers.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentCustomerIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${currentCustomerIndex === idx ? 'w-8 bg-[#D4A63F]' : 'w-2 bg-gray-200 hover:bg-gray-300'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </section>

      {/* Lightbox / View All Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 md:p-10 transition-all duration-300">
          <div className="bg-white rounded-[32px] w-full max-w-6xl max-h-[85vh] overflow-y-auto shadow-2xl relative border border-gray-100">
            
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-20">
              <div className="text-left">
                <span className="text-[#D4A63F] text-[10px] font-extrabold uppercase tracking-widest block mb-1 font-sans">Delivering Smiles</span>
                <h3 className="text-xl sm:text-3xl font-black text-[#111111] font-display tracking-tight">All Delivery Moments</h3>
              </div>
              <button 
                onClick={() => setIsLightboxOpen(false)}
                className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 text-2xl transition-all cursor-pointer font-bold"
                aria-label="Close Lightbox"
              >
                &times;
              </button>
            </div>

            {/* Grid */}
            <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayCustomers.map((cust) => (
                <div key={cust._id} className="bg-[#FAFAF8] rounded-[24px] overflow-hidden border border-gray-150 shadow-soft flex flex-col justify-between group">
                  <div className="h-56 relative overflow-hidden bg-gray-200">
                    <Image 
                      src={getOptimizedImageUrl(cust.imageUrl, 400, 300)} 
                      alt={cust.name} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-103"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-3 left-3 bg-[#D4A63F] text-black font-extrabold text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded font-sans shadow-sm z-10">
                      🎉 Delivered
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-extrabold text-lg text-[#111111] font-display">{cust.name}</h4>
                        <div className="flex text-amber-500 text-xs">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className={i < cust.rating ? 'fill-amber-500' : 'text-gray-200'} />
                          ))}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[10px] text-[#D4A63F] font-bold uppercase tracking-wider mb-4 bg-[#D4A63F]/10 px-2 py-0.5 rounded font-sans">
                        <FaCar size={8} />
                        <span>{cust.vehicleName}</span>
                      </div>
                      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed font-sans mb-4 italic">
                        "{cust.review}"
                      </p>
                    </div>
                    <div className="border-t border-gray-200/60 pt-4 flex justify-between items-center mt-auto">
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider font-sans block">Delivery Date</span>
                      <span className="text-xs text-gray-700 font-bold font-sans">{cust.deliveryDate || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
