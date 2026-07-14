import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#111111] text-gray-400 pt-16 pb-8 border-t border-[#2B2B2B]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-black text-white mb-6 tracking-tight font-display">Indori Gaadiwala</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
                            Indore's most trusted platform for premium used vehicles. Quality, transparency, and seamless RC transfer — all in one place.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs font-sans">Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                { href: '/', label: 'Home' },
                                { href: '/vehicles', label: 'Browse Vehicles' },
                                { href: '/services/inspection', label: 'Vehicle Inspection' },
                                { href: '/services/finance', label: 'Finance Calculator' },
                                { href: '/services/rto', label: 'RTO & Transfer Services' },
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link href={link.href} className="hover:text-[#D4A63F] transition-colors text-sm font-medium text-gray-400">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs font-sans">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3 text-sm text-gray-400">
                                <FaEnvelope className="text-[#D4A63F]" />
                                <span className="hover:text-[#D4A63F] transition-colors cursor-pointer">indorigaadiwala@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-3 text-sm text-gray-400">
                                <FaPhone className="text-[#D4A63F] mt-1" />
                                <div className="space-y-1">
                                    <span className="hover:text-[#D4A63F] transition-colors cursor-pointer block">+91 9617773344</span>
                                    <span className="hover:text-[#D4A63F] transition-colors cursor-pointer block">+91 9826303723</span>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3 text-sm text-gray-400">
                                <FaMapMarkerAlt className="text-[#D4A63F] mt-1 flex-shrink-0" />
                                <span className="hover:text-[#D4A63F] transition-colors cursor-pointer leading-relaxed">
                                    Rajendra Dharkar Marg, Near Vaishno Dham Temple, In front of Gurukripa, Bhicholi Mardana, Indore
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs font-sans">Follow Us</h4>
                        <div className="flex space-x-3">
                            <a 
                                href="https://www.instagram.com/shree_dadaji_motors?igsh=MTgwenE5ZnRyN3hjNQ==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:border-[#D4A63F] hover:text-[#D4A63F] hover:scale-105 transition-all duration-300"
                            >
                                <FaInstagram size={18} />
                            </a>
                            <a 
                                href="#" 
                                className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white hover:border-[#D4A63F] hover:text-[#D4A63F] hover:scale-105 transition-all duration-300"
                            >
                                <FaFacebook size={18} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em]">
                        &copy; 2026 Indori Gaadiwala. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-500">
                        <Link href="/privacy" className="hover:text-[#D4A63F] transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-[#D4A63F] transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
