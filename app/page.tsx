'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  FaMoneyBillWave, 
  FaFileAlt, 
  FaUmbrella, 
  FaUsers, 
  FaAward, 
  FaFileContract,
  FaArrowRight,
  FaTruck,
  FaHeadphones,
  FaWrench,
  FaChevronLeft
} from 'react-icons/fa';

const DEFAULT_HAPPY_CUSTOMERS = [
  {
    _id: 'default-1',
    name: 'Rahul & Priya Dwivedi',
    vehicleName: 'Mahindra Thar (2024)',
    imageUrl: '/customer-1.png'
  },
  {
    _id: 'default-2',
    name: 'Sandeep Vyas & Family',
    vehicleName: 'Maruti Suzuki Baleno (2023)',
    imageUrl: '/customer-2.png'
  },
  {
    _id: 'default-3',
    name: 'Amanpreet Singh',
    vehicleName: 'Royal Enfield Himalayan (2024)',
    imageUrl: '/customer-3.png'
  },
  {
    _id: 'default-4',
    name: 'Vikramaditya Solanki',
    vehicleName: 'Honda City Zx (2023)',
    imageUrl: '/customer-4.png'
  },
  {
    _id: 'default-5',
    name: 'Anish & Shweta Sharma',
    vehicleName: 'Hyundai Creta SX (2023)',
    imageUrl: '/customer-1.png'
  },
  {
    _id: 'default-6',
    name: 'Rohan Deshmukh',
    vehicleName: 'Tata Nexon EV (2024)',
    imageUrl: '/customer-2.png'
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
  const [featuredVehicles, setFeaturedVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [happyCustomers, setHappyCustomers] = useState<HappyCustomer[]>([]);
  const [currentCustomerIndex, setCurrentCustomerIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

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
      const fetched = response.data.data || [];
      if (fetched.length >= 2) {
        setHappyCustomers(fetched);
      }
    } catch (error) {
      console.error('Error loading happy customers:', error);
    }
  };

  const displayCustomers = happyCustomers.length >= 2 ? happyCustomers : DEFAULT_HAPPY_CUSTOMERS;
  
  // Create 3x duplicated array so infinite looping never runs out of slides regardless of screen size
  const extendedCustomers = [...displayCustomers, ...displayCustomers, ...displayCustomers];

  // Auto-swipe effect for happy customers carousel
  useEffect(() => {
    if (displayCustomers.length <= 1) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentCustomerIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(timer);
  }, [displayCustomers.length]);

  // Seamless reset when reaching the cloned start (displayCustomers.length)
  useEffect(() => {
    if (currentCustomerIndex >= displayCustomers.length) {
      const timeout = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentCustomerIndex(0);
      }, 700); // 700ms matches the CSS transition duration
      return () => clearTimeout(timeout);
    }
  }, [currentCustomerIndex, displayCustomers.length]);

  // Re-enable transition after seamless instant jump
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);



  return (
    <div className="bg-white">
      {/* Welcome Popup */}
      <WelcomePopup />

      {/* Hero Section */}
      <section className="hero relative bg-[#FAF9F5] bg-road-pattern border-b border-[#E7E2D8]">
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
          {/* Desktop Gradient Overlay (Warm Ivory 90deg) */}
          <div className="absolute inset-0 md:block hidden" style={{ background: 'linear-gradient(90deg, rgba(250,249,245,0) 20%, rgba(250,249,245,0.45) 48%, rgba(250,249,245,0.88) 68%, #FAF9F5 100%)' }} />
          {/* Mobile Gradient Overlay (Warm Ivory to bottom) */}
          <div className="absolute inset-0 md:hidden block" style={{ background: 'linear-gradient(to bottom, rgba(250,249,245,0.3) 0%, rgba(250,249,245,0.95) 65%, #FAF9F5 100%)' }} />
        </div>

        {/* Subtle Gold Radial Glow Atmosphere Behind Heading */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: "radial-gradient(circle at 72% 38%, rgba(212,166,63,0.10) 0%, rgba(212,166,63,0.035) 28%, transparent 55%)"
          }}
        />

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
            <p className="text-[#536579] mb-8 max-w-xl text-base font-medium leading-relaxed font-sans text-left">
              From buying to financing, RTO paperwork to ownership transfer — you handle the steering. We handle everything else.
            </p>
            
            {/* Features Row (3 columns with dividers) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#E7E2D8] mt-4 w-full max-w-xl border-t border-[#E7E2D8] pt-6">
              
              <div className="flex items-center space-x-3 pb-4 sm:pb-0">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-sm">
                  <FaShieldAlt />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#111111] font-sans">Trusted &amp; Secure</h4>
                  <p className="text-[10px] text-[#536579] font-sans font-medium">Verified vehicles &amp; safe transactions</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 sm:pt-0 sm:pl-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-sm">
                  <FaFileContract />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#111111] font-sans">Hassle-Free Process</h4>
                  <p className="text-[10px] text-[#536579] font-sans font-medium">We handle all RTO paperwork</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-4 sm:pt-0 sm:pl-4">
                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-sm">
                  <FaHeadphones />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-[#111111] font-sans">Expert Support</h4>
                  <p className="text-[10px] text-[#536579] font-sans font-medium">Dedicated support at every step</p>
                </div>
              </div>
              
            </div>
            
          </div>
        </div>
      </section>



      {/* Photo Marquee (Warm Ivory Ribbon) */}
      <section className="bg-[#FAF9F5] bg-road-pattern border-y border-[#E7E2D8] py-3.5 relative overflow-hidden shadow-soft z-10">
        {/* Subtle background golden ambient glow */}
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-20 bg-[#D4A63F]/8 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full flex flex-row flex-nowrap items-center overflow-hidden">
          {/* Marquee Track */}
          <div className="relative overflow-hidden w-full py-0.5 flex flex-row flex-nowrap items-center">
            <div className="animate-marquee flex flex-row flex-nowrap items-center gap-3.5 sm:gap-4.5">
              {[...displayCustomers, ...displayCustomers, ...displayCustomers, ...displayCustomers].map((cust, idx) => (
                <div 
                  key={`marquee-${cust._id || 'cust'}-${idx}`}
                  className="w-40 sm:w-48 h-20 sm:h-24 flex-shrink-0 relative rounded-xl overflow-hidden border-2 border-white hover:border-[#D4A63F] transition-all duration-300 group cursor-pointer shadow-soft"
                >
                  <Image 
                    src={getOptimizedImageUrl(cust.imageUrl, 400, 300)} 
                    alt={cust.name} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-108"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-12 sm:py-16 bg-[#FAF9F5] border-b border-[#E7E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12">
            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">Curated Selection</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-2 tracking-tight font-display">
              Featured Showroom
            </h2>
            <p className="text-[#536579] font-medium text-base font-sans">Handpicked premium pre-owned vehicles in Indore</p>
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
            <p className="text-center text-[#536579] py-20 font-medium font-sans">No premium vehicles listed at the moment.</p>
          )}

          <div className="mt-10 text-center flex justify-center">
            <Link href="/vehicles" className="btn-primary w-full sm:w-auto px-8 py-4 justify-center inline-flex items-center gap-2 group font-sans font-bold">
              <span>View All Vehicles</span>
              <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section 
        className="py-12 sm:py-16 bg-road-pattern border-b border-[#E7E2D8]"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(212,166,63,0.07), transparent 38%), #F7F5EF'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">End-to-End Solutions</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 tracking-tight font-display">
              Premium Services
            </h2>
            <p className="text-base text-[#536579] max-w-2xl mx-auto font-medium font-sans">
              Complete peace of mind - from choosing your ride to financing, registration, and safety protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Finance */}
            <div 
              className="group card p-8 bg-white border-[#E7E2D8] hover:border-[#D4A63F] transition-all duration-300"
              style={{ boxShadow: '0 12px 40px rgba(17,17,17,0.045)' }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4A63F]/10 text-[#D4A63F] rounded-full mb-6 group-hover:bg-[#D4A63F] group-hover:text-black transition-all duration-300">
                <FaMoneyBillWave className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3 tracking-tight font-display">Easy Finance</h3>
              <p className="text-[#536579] mb-6 leading-relaxed font-sans text-sm font-medium">
                Get quick loan approvals and flexible EMI options. Drive home your favorite vehicle with payment plans tailored for you.
              </p>
              <Link href="/services/finance" className="flex items-center text-[#111111] font-bold group-hover:text-[#D4A63F] transition-colors font-sans text-xs uppercase tracking-wider gap-1.5">
                <span>Learn More</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* RTO */}
            <div 
              className="group card p-8 bg-white border-[#E7E2D8] hover:border-[#D4A63F] transition-all duration-300"
              style={{ boxShadow: '0 12px 40px rgba(17,17,17,0.045)' }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4A63F]/10 text-[#D4A63F] rounded-full mb-6 group-hover:bg-[#D4A63F] group-hover:text-black transition-all duration-300">
                <FaFileAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3 tracking-tight font-display">RTO Services</h3>
              <p className="text-[#536579] mb-6 leading-relaxed font-sans text-sm font-medium">
                Completely hassle-free registration and ownership transfer. We manage all RC transfer documents, NOC, and state clearances.
              </p>
              <Link href="/services/rto" className="flex items-center text-[#111111] font-bold group-hover:text-[#D4A63F] transition-colors font-sans text-xs uppercase tracking-wider gap-1.5">
                <span>Learn More</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>

            {/* Insurance */}
            <div 
              className="group card p-8 bg-white border-[#E7E2D8] hover:border-[#D4A63F] transition-all duration-300"
              style={{ boxShadow: '0 12px 40px rgba(17,17,17,0.045)' }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 bg-[#D4A63F]/10 text-[#D4A63F] rounded-full mb-6 group-hover:bg-[#D4A63F] group-hover:text-black transition-all duration-300">
                <FaUmbrella className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-3 tracking-tight font-display">Insurance</h3>
              <p className="text-[#536579] mb-6 leading-relaxed font-sans text-sm font-medium">
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
      <section className="py-12 sm:py-14 bg-[#F5F3ED] bg-road-pattern border-b border-[#E7E2D8]">
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
      <section className="py-12 sm:py-16 bg-[#FAF9F5] border-b border-[#E7E2D8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">Why Indori Gaadiwala</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-4 tracking-tight font-display">
              The Luxury Experience
            </h2>
            <p className="text-base text-[#536579] max-w-xl mx-auto font-medium font-sans">
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
              <div key={i} className="flex items-start space-x-5 p-4 rounded-2xl hover:bg-white transition-colors duration-300">
                <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-full bg-[#D4A63F]/10 text-[#D4A63F] text-2xl">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#111111] mb-2 font-display">{feature.title}</h3>
                  <p className="text-[#536579] text-sm leading-relaxed font-sans font-medium">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Happy Customers Photo Show Section */}
      <section className="py-12 sm:py-16 bg-[#F5F3ED] bg-road-pattern border-b border-[#E7E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Trust Statistics Bar */}
          <div className="mb-12">
            <div className="bg-white border border-[#E7E2D8] rounded-[24px] p-6 sm:p-8 shadow-soft grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
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
                    <div className="text-xs text-[#536579] font-semibold font-sans">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-[#D4A63F] text-xs font-extrabold uppercase tracking-widest block mb-3 font-sans">Delivering Smiles</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#111111] mb-2 tracking-tight font-display">
              Happy Customers Photo Show
            </h2>
            <p className="text-[#536579] font-medium text-base font-sans">Real delivery moments from Indori Gaadiwala</p>
          </div>

          {/* Photo Carousel Slider */}
          <div className="relative max-w-7xl mx-auto overflow-hidden px-1 py-2">
            <div 
              className="carousel-track flex gap-6"
              style={{ 
                transform: `translateX(calc(-${currentCustomerIndex} * (var(--slide-width) + var(--slide-gap))))`,
                transition: isTransitioning ? 'transform 700ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
              }}
            >
              {extendedCustomers.map((cust, idx) => (
                <div 
                  key={`${cust._id || 'cust'}-${idx}`}
                  className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.3333%-1rem)] flex-shrink-0 bg-white border border-[#E7E2D8] rounded-[24px] overflow-hidden shadow-medium flex flex-col group"
                >
                  {/* Photo Container */}
                  <div className="h-72 sm:h-80 relative overflow-hidden bg-gray-100">
                    <Image 
                      src={getOptimizedImageUrl(cust.imageUrl, 600, 450)} 
                      alt={cust.name} 
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />
                    

                    {/* Customer & Vehicle Info Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 z-10 text-left">
                      <div className="inline-flex items-center gap-1.5 text-[10px] text-[#D4A63F] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md font-sans border border-[#D4A63F]/30 mb-2">
                        <FaCar size={10} />
                        <span>{cust.vehicleName}</span>
                      </div>
                      <h4 className="text-white font-black text-xl font-display tracking-tight leading-tight drop-shadow-md">
                        {cust.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Indicator Dots */}
            {displayCustomers.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {displayCustomers.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setIsTransitioning(true);
                      setCurrentCustomerIndex(idx);
                    }}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      (currentCustomerIndex % displayCustomers.length) === idx
                        ? 'w-8 bg-[#D4A63F]'
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-14 bg-[#FAF9F5]">
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
