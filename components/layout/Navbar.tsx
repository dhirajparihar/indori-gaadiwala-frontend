'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaCar, FaMotorcycle, FaBars, FaTimes, FaTruck, FaWrench } from 'react-icons/fa';

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/vehicles', label: 'Browse' },
        { href: '/vehicles?type=car', label: 'Cars', icon: <FaCar /> },
        { href: '/vehicles?type=bike', label: 'Bikes', icon: <FaMotorcycle /> },
        { href: '/vehicles?type=commercial', label: 'Commercial', icon: <FaTruck /> },
        { href: '/services/inspection', label: 'Inspection', icon: <FaWrench /> },
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        const [path, query] = href.split('?');
        if (path !== pathname) return false;
        if (!query) return !searchParams.toString();
        return searchParams.toString().includes(query);
    };

    return (
        <nav className="bg-white sticky top-0 z-50 nav-container shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 shrink-0 nav-logo">
                        <Image src="/logo-4.png" alt="Logo" width={56} height={56} className="object-contain" priority />
                        <span className="text-2xl font-black text-black tracking-tighter hidden sm:block font-display">Indori Gaadiwala</span>
                        <span className="text-xl font-black text-black tracking-tighter sm:hidden font-display">IndoriGaadiwala</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center h-full space-x-4">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`h-full flex items-center px-4 text-base font-bold transition-all relative group ${
                                        active ? 'text-[#D4A63F]' : 'text-neutral-900 hover:text-[#D4A63F]'
                                    }`}
                                    style={{ fontFamily: 'var(--font-sans)' }}
                                >
                                    {link.icon && (
                                        <span className={`mr-2 text-sm transition-colors ${
                                            active ? 'text-[#D4A63F]' : 'text-neutral-500 group-hover:text-[#D4A63F]'
                                        }`}>
                                            {link.icon}
                                        </span>
                                    )}
                                    {link.label}
                                    {active && (
                                        <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#D4A63F] rounded-full" />
                                    )}
                                </Link>
                            );
                        })}

                        <div className="pl-6 ml-6 border-l border-gray-100 flex items-center">
                            <Link
                                href="/sell-vehicle"
                                className="bg-[#111111] text-white font-extrabold hover:bg-neutral-800 transition-colors px-6 py-2.5 rounded-full text-sm inline-flex items-center gap-2 group shadow-sm font-sans"
                            >
                                <span>Sell Vehicle</span>
                                <span className="text-[#D4A63F] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 font-bold">↗</span>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-50 flex flex-col space-y-1 mobile-menu">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-4 py-3 text-base font-semibold rounded-full transition-colors ${
                                        active ? 'bg-neutral-50 text-[#D4A63F] font-extrabold border-l-4 border-[#D4A63F]' : 'text-neutral-500 hover:bg-gray-50 hover:text-[#D4A63F]'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <div className="flex items-center">
                                        {link.icon && (
                                            <span className={`mr-3 text-lg ${active ? 'text-[#D4A63F]' : 'text-neutral-400'}`}>
                                                {link.icon}
                                            </span>
                                        )}
                                        {link.label}
                                    </div>
                                </Link>
                            );
                        })}
                        <div className="pt-4 px-4 border-t border-gray-100">
                            <Link
                                href="/sell-vehicle"
                                className="w-full bg-[#111111] text-white hover:bg-neutral-800 transition-all py-3 rounded-full text-center font-extrabold text-sm flex items-center justify-center gap-2 group font-sans"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span>Sell Vehicle</span>
                                <span className="text-[#D4A63F]">↗</span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
