import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    CheckBadgeIcon,
    UserCircleIcon,
    HeartIcon,
    PhoneIcon,
    MapPinIcon,
    CalculatorIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Navbar({ onDonateClick }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const raw = localStorage.getItem('assholihin_auth_session');
                if (raw) {
                    setLoggedUser(JSON.parse(raw));
                } else {
                    setLoggedUser(null);
                }
            } catch {
                setLoggedUser(null);
            }
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        window.addEventListener('assholihin-auth-change', checkAuth);
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('assholihin-auth-change', checkAuth);
        };
    }, [location.pathname]);

    const navLinks = [
        { name: 'Beranda', href: isHome ? '#hero' : '/' },
        { name: 'Tentang Kami', href: isHome ? '#about' : '/#about' },
        { name: 'Program Unggulan', href: isHome ? '#programs' : '/#programs' },
        { name: 'Kalkulator Zakat', href: isHome ? '#zakat' : '/#zakat' },
        { name: 'Rekening Donasi', href: isHome ? '#rekening' : '/#rekening' },
        { name: 'Transparansi', href: isHome ? '#transparency' : '/#transparency' },
        { name: 'Galeri', href: isHome ? '#gallery' : '/#gallery' },
    ];

    return (
        <header className="sticky top-0 w-full z-50">
            {/* Top Bar ala PondokYatim.or.id */}
            <div className="bg-primary text-emerald-50 text-xs py-2 border-b border-emerald-800/60">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 font-medium text-white">
                            <CheckBadgeIcon className="w-4 h-4 text-emerald-300 shrink-0" />
                            <span>Yayasan Assholihin Candimulyo Jombang</span>
                        </span>
                        <span className="hidden md:inline text-emerald-300/60">|</span>
                        <span className="hidden md:inline-flex items-center gap-1 text-emerald-100">
                            <MapPinIcon className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Candimulyo, Kab. Jombang — Jawa Timur</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={isHome ? '#zakat' : '/#zakat'}
                            className="hidden sm:inline-flex items-center gap-1 text-emerald-100 hover:text-white font-medium transition-colors"
                        >
                            <CalculatorIcon className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Hitung Zakat</span>
                        </a>
                        <span className="hidden sm:inline text-emerald-300/60">|</span>
                        <a
                            href="https://wa.me/6281234567890"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-white hover:text-emerald-200 font-semibold transition-colors"
                        >
                            <PhoneIcon className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Layanan Jemput Donasi: 0812-3456-7890</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <nav
                className={clsx(
                    'w-full transition-all duration-200 border-b',
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md border-slate-200/80 shadow-sm py-3'
                        : 'bg-white border-slate-100 py-3.5'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Brand Identity */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <img
                            src={`${import.meta.env.BASE_URL}img/logo.png`}
                            alt="Logo Yayasan Assholihin"
                            className="h-11 w-11 rounded-lg object-contain border border-slate-200/60 p-0.5 bg-white shadow-sm"
                        />
                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-base sm:text-lg text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                                Panti Asuhan As-Sholihin
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                                Pondok Yatim & Dhuafa — Candimulyo Jombang
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden xl:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center gap-2.5">
                        <Link
                            to="/portal-donatur"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                        >
                            <UserCircleIcon className="w-5 h-5 text-primary" />
                            <span>
                                {loggedUser ? loggedUser.fullName.split(' ')[0] : 'Masuk / Daftar'}
                            </span>
                        </Link>
                        <button
                            onClick={() => onDonateClick && onDonateClick()}
                            className="btn-primary"
                        >
                            <HeartIcon className="w-4 h-4 stroke-[2.2]" />
                            <span>Tunaikan Donasi</span>
                        </button>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="xl:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3">
                        <div className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
                            <Link
                                to="/portal-donatur"
                                onClick={() => setIsOpen(false)}
                                className="btn-outline w-full justify-center"
                            >
                                <UserCircleIcon className="w-5 h-5 text-primary" />
                                <span>
                                    {loggedUser
                                        ? `Dashboard Akun (${loggedUser.fullName})`
                                        : 'Masuk / Daftar Akun Donatur'}
                                </span>
                            </Link>
                            <button
                                className="btn-primary w-full justify-center"
                                onClick={() => {
                                    setIsOpen(false);
                                    if (onDonateClick) onDonateClick();
                                }}
                            >
                                <HeartIcon className="w-4 h-4" />
                                <span>Tunaikan Donasi Sekarang</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
