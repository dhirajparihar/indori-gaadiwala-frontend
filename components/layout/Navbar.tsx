'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { FaCar, FaMotorcycle, FaBars, FaTimes, FaTruck } from 'react-icons/fa';

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
    ];

    const isActive = (href: string) => {
        if (href === '/') return pathname === '/';
        const [path, query] = href.split('?');
        if (path !== pathname) return false;
        if (!query) return !searchParams.toString(); // If link has no query, active only if current URL has no query
        return searchParams.toString().includes(query);
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 nav-container">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-1 shrink-0 nav-logo">
                        <Image src="/logo-4.png" alt="Logo" width={56} height={56} className="object-contain" priority />
                        <span className="text-2xl font-black text-black tracking-tighter hidden sm:block">Indori Gaadiwala</span>
                        <span className="text-xl font-black text-black tracking-tighter sm:hidden">IndoriGaadiwala</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center h-full space-x-1">
                        {navLinks.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`h-full flex items-center px-5 text-base font-bold transition-all relative group ${active ? 'text-black' : 'text-[#71717A] hover:text-black'
                                        }`}
                                    style={{ fontFamily: 'var(--font-sans)' }}
                                >
                                    {link.icon && <span className={`mr-1.5 transition-opacity ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{link.icon}</span>}
                                    {link.label}
                                    {active && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full" />
                                    )}
                                </Link>
                            );
                        })}

                        <div className="pl-4 ml-4 border-l border-gray-100 flex items-center">
                            <Link
                                href="/sell-vehicle"
                                className="btn-primary px-6 py-2"
                            >
                                Sell Vehicle
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
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-3 text-base font-semibold rounded-full transition-colors ${pathname === link.href ? 'bg-[#F8FAFC] text-black font-extrabold' : 'text-[#71717A] hover:bg-gray-50 hover:text-black'
                                    }`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <div className="flex items-center">
                                    {link.icon && <span className="mr-3 text-lg opacity-70">{link.icon}</span>}
                                    {link.label}
                                </div>
                            </Link>
                        ))}
                        <div className="pt-4 px-4 border-t border-gray-100">
                            <Link
                                href="/sell-vehicle"
                                className="block w-full btn-primary py-3 text-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Sell Vehicle
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
