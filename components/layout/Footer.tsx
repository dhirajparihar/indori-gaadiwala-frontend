import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-[#F8FAFC] text-[#71717A] pt-16 pb-8 border-t border-[#E4E4E7]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-2xl font-black text-[#09090B] mb-6 tracking-tight">Indori Gaadiwala</h3>
                        <p className="text-[#71717A] text-sm leading-relaxed mb-6">
                            Indore's most trusted platform for premium used vehicles. Quality, transparency, and seamless RC transfer — all in one place.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-[#09090B] mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/" className="hover:text-black transition-colors text-sm font-medium text-[#71717A]">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/vehicles" className="hover:text-black transition-colors text-sm font-medium text-[#71717A]">
                                    Browse Vehicles
                                </Link>
                            </li>
                            <li>
                                <Link href="/vehicles?type=car" className="hover:text-black transition-colors text-sm font-medium text-[#71717A]">
                                    Cars in Indore
                                </Link>
                            </li>
                            <li>
                                <Link href="/vehicles?type=bike" className="hover:text-black transition-colors text-sm font-medium text-[#71717A]">
                                    Bikes & Scooters
                                </Link>
                            </li>
                            <li>
                                <Link href="/vehicles?type=commercial" className="hover:text-black transition-colors text-sm font-medium text-[#71717A]">
                                    Commercial Vehicles
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-[#09090B] mb-6 uppercase tracking-wider text-xs">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3 text-sm text-[#71717A]">
                                <FaEnvelope className="text-black" />
                                <span className="hover:text-black transition-colors cursor-pointer">indorigaadiwala@gmail.com</span>
                            </li>
                            <li className="flex items-start space-x-3 text-sm text-[#71717A]">
                                <FaPhone className="text-black mt-1" />
                                <div className="space-y-1">
                                    <span className="hover:text-black transition-colors cursor-pointer block">+91 9617773344</span>
                                    <span className="hover:text-black transition-colors cursor-pointer block">+91 9826303723</span>
                                </div>
                            </li>
                            <li className="flex items-start space-x-3 text-sm text-[#71717A]">
                                <FaMapMarkerAlt className="text-black mt-1" />
                                <span className="hover:text-black transition-colors cursor-pointer">Rajendra Dharkar Marg, Near Vaishno Dham Temple, In front of Gurukripa, Bhicholi Mardana, Indore</span>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-[#09090B] mb-6 uppercase tracking-wider text-xs">Follow Us</h4>
                        <div className="flex space-x-3">
                            <a 
                                href="https://www.instagram.com/shree_dadaji_motors?igsh=MTgwenE5ZnRyN3hjNQ==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                            >
                                <FaInstagram size={18} />
                            </a>
                            {[
                                { icon: <FaFacebook size={18} />, href: '#' },
                            ].map((social, i) => (
                                <a key={i} href={social.href} className="w-10 h-10 rounded-full bg-white border border-[#E4E4E7] flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300">
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#E4E4E7] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
                        &copy; 2026 Indori Gaadiwala. All rights reserved.
                    </p>
                    <div className="flex space-x-6 text-[10px] uppercase font-bold tracking-[0.2em] text-gray-400">
                        <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
