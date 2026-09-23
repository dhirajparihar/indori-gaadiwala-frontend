'use client';

import { usePathname } from 'next/navigation';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppFloatingButton() {
    const pathname = usePathname();

    // Do not show on any admin routes
    if (pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <a
            href="https://wa.me/message/JYVVVT3CSIBTH1"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 group"
            aria-label="Chat on WhatsApp"
            title="Chat with us on WhatsApp"
        >
            <FaWhatsapp className="text-3xl drop-shadow-md" />
            <span className="absolute right-16 bg-neutral-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none font-sans">
                Chat on WhatsApp
            </span>
        </a>
    );
}
