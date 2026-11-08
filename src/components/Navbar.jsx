import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    HeartIcon
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
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = () => {
            try {
                const raw = localStorage.getItem('assholihin_auth_session');
                setLoggedUser(raw ? JSON.parse(raw) : null);
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
        { name: 'Program', href: isHome ? '#programs' : '/#programs' },
        { name: 'Transparansi', href: isHome ? '#transparency' : '/#transparency' },
        { name: 'Galeri', href: isHome ? '#gallery' : '/#gallery' }
    ];

    return (
        <header className="sticky top-0 w-full z-50">
            <nav
                className={clsx(
                    'w-full transition-all duration-200 border-b',
                    scrolled
                        ? 'bg-white/95 backdrop-blur-md border-slate-200/80 shadow-xs py-2.5'
                        : 'bg-white border-slate-100 py-3'
                )}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {/* Brand Identity */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                        <img
                            src={`${import.meta.env.BASE_URL}img/logo.png`}
                            alt="Logo Yayasan Assholihin"
                            className="h-10 w-10 rounded-lg object-contain border border-slate-200/60 p-0.5 bg-white"
                        />
                        <div className="flex flex-col">
                            <span className="font-heading font-bold text-base text-slate-900 tracking-tight leading-tight group-hover:text-primary transition-colors">
                                As-Sholihin
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                                Candimulyo Jombang
                            </span>
                        </div>
                    </Link>

                    {/* 4 Core Links Only */}
                    <div className="hidden md:flex items-center gap-7">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden md:flex items-center gap-2.5">
                        <Link
                            to="/portal-donatur"
                            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all hover:-translate-y-0.5"
                        >
                            {loggedUser?.avatarUrl ? (
                                <img
                                    src={loggedUser.avatarUrl}
                                    alt={loggedUser.fullName}
                                    className="w-5 h-5 rounded-full object-cover border border-primary/40"
                                />
                            ) : (
                                <UserCircleIcon className="w-4 h-4 text-primary" />
                            )}
                            <span>
                                {loggedUser ? loggedUser.fullName.split(' ')[0] : 'Portal Donatur'}
                            </span>
                        </Link>
                        <button
                            onClick={() => onDonateClick && onDonateClick()}
                            className="btn-primary py-2 px-4 text-xs sm:text-sm"
                        >
                            <HeartIcon className="w-4 h-4 stroke-[2.2]" />
                            <span>Donasi</span>
                        </button>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Toggle Menu"
                    >
                        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {isOpen && (
                    <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3">
                        <div className="flex flex-col space-y-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                            <Link
                                to="/portal-donatur"
                                onClick={() => setIsOpen(false)}
                                className="btn-outline w-full justify-center py-2 text-xs"
                            >
                                {loggedUser?.avatarUrl ? (
                                    <img
                                        src={loggedUser.avatarUrl}
                                        alt={loggedUser.fullName}
                                        className="w-5 h-5 rounded-full object-cover border border-primary/40"
                                    />
                                ) : (
                                    <UserCircleIcon className="w-4 h-4 text-primary" />
                                )}
                                <span>{loggedUser ? loggedUser.fullName : 'Portal Donatur'}</span>
                            </Link>
                            <button
                                className="btn-primary w-full justify-center py-2.5 text-xs"
                                onClick={() => {
                                    setIsOpen(false);
                                    if (onDonateClick) onDonateClick();
                                }}
                            >
                                <HeartIcon className="w-4 h-4" />
                                <span>Donasi Sekarang</span>
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
