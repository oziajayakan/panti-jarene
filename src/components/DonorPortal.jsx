import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DonationModal from './DonationModal';
import {
    UserCircleIcon,
    CreditCardIcon,
    Cog6ToothIcon,
    ClockIcon,
    CheckBadgeIcon,
    PlusIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    ShieldCheckIcon,
    LockClosedIcon,
    ArrowRightOnRectangleIcon,
    UserPlusIcon,
    KeyIcon
} from '@heroicons/react/24/outline';

const SAMPLE_HISTORY = [
    {
        id: 'ORD-20261031-091',
        date: '31 Okt 2026',
        program: 'Beasiswa SPP & Pendidikan Santri Yatim',
        amount: 250000,
        method: 'QRIS Nasional',
        status: 'Berhasil (Settlement)'
    },
    {
        id: 'ORD-20261015-044',
        date: '15 Okt 2026',
        program: 'Pemenuhan Pangan & Gizi Asrama',
        amount: 100000,
        method: 'BSI Virtual Account',
        status: 'Berhasil (Settlement)'
    }
];

export default function DonorPortal() {
    const [authUser, setAuthUser] = useState(() => {
        try {
            const raw = localStorage.getItem('assholihin_auth_session');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
    const [authError, setAuthError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');

    // Form State Login
    const [loginData, setLoginData] = useState({
        identifier: '',
        password: ''
    });

    // Form State Register
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        whatsapp: '',
        password: '',
        confirmPassword: '',
        alwaysAnonymous: false
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [isDonateOpen, setIsDonateOpen] = useState(false);
    const [savedMessage, setSavedMessage] = useState('');

    const [historyList, setHistoryList] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
            return [...saved, ...SAMPLE_HISTORY];
        } catch {
            return SAMPLE_HISTORY;
        }
    });

    useEffect(() => {
        const refreshHistory = async () => {
            try {
                const saved = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
                const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

                // 0. Scan seluruh donasi_meta_DONASI-* di localStorage agar tidak ada order yang terlewat
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('donasi_meta_')) {
                        try {
                            const meta = JSON.parse(localStorage.getItem(key));
                            if (meta && meta.order_id && !saved.some(s => s.id === meta.order_id)) {
                                const formattedDate = new Intl.DateTimeFormat('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }).format(new Date(meta.created_at || Date.now()));
                                saved.unshift({
                                    id: meta.order_id,
                                    donorName: meta.customer_name || 'Hamba Allah',
                                    date: formattedDate,
                                    program: meta.program || 'Santunan & Pendidikan Anak Yatim',
                                    amount: Number(meta.amount || 50000),
                                    method: (meta.payment_channel || 'MIDTRANS SNAP').replace(/_/g, ' '),
                                    status: ['paid', 'success'].includes(meta.status) ? 'Berhasil (Settlement)' : 'Menunggu Pembayaran'
                                });
                            }
                        } catch {}
                    }
                }

                // 1. Ambil daftar order dari server (/api/orders yang otomatis cek ke Midtrans)
                try {
                    const res = await fetch(`${baseUrl}/orders?t=${Date.now()}`);
                    if (res.ok) {
                        const serverOrders = await res.json();
                        if (Array.isArray(serverOrders)) {
                            serverOrders.forEach(so => {
                                const formattedDate = new Intl.DateTimeFormat('id-ID', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric'
                                }).format(new Date(so.created_at || Date.now()));
                                const mapped = {
                                    id: so.order_id,
                                    donorName: so.customer_name || 'Hamba Allah',
                                    date: formattedDate,
                                    program: so.program || 'Santunan & Pendidikan Anak Yatim',
                                    amount: Number(so.amount || 50000),
                                    method: (so.payment_channel || 'MIDTRANS SNAP').replace(/_/g, ' '),
                                    status: ['paid', 'success'].includes(so.status)
                                        ? 'Berhasil (Settlement)'
                                        : ['expired', 'failed', 'cancelled'].includes(so.status)
                                        ? 'Dibatalkan / Kedaluwarsa'
                                        : 'Menunggu Pembayaran'
                                };
                                const idx = saved.findIndex(item => item.id === mapped.id);
                                if (idx >= 0) {
                                    saved[idx] = { ...saved[idx], ...mapped };
                                } else {
                                    saved.unshift(mapped);
                                }
                            });
                        }
                    }
                } catch {}

                // 2. Auto-check langsung ke API Midtrans untuk setiap transaksi yang ada di daftar
                await Promise.all(
                    saved.map(async (item, index) => {
                        if (!item.id || item.id.startsWith('ORD-') || item.id.startsWith('MANUAL-')) return;
                        try {
                            const statusRes = await fetch(`${baseUrl}/landing/payment/status/${encodeURIComponent(item.id)}?t=${Date.now()}`);
                            if (statusRes.ok) {
                                const statusJson = await statusRes.json();
                                if (statusJson?.success && statusJson?.data) {
                                    const d = statusJson.data;
                                    saved[index] = {
                                        ...item,
                                        donorName: item.donorName || d.customer_name || 'Hamba Allah',
                                        amount: Number(d.amount || item.amount),
                                        method: (d.payment_channel || item.method || 'MIDTRANS SNAP').replace(/_/g, ' '),
                                        status: ['paid', 'success'].includes(d.status)
                                            ? 'Berhasil (Settlement)'
                                            : ['expired', 'failed', 'cancelled'].includes(d.status)
                                            ? 'Dibatalkan / Kedaluwarsa'
                                            : 'Menunggu Pembayaran'
                                    };
                                }
                            }
                        } catch {}
                    })
                );

                localStorage.setItem('assholihin_donor_history', JSON.stringify(saved));
                setHistoryList([...saved, ...SAMPLE_HISTORY]);
            } catch {
                // fallback to localStorage
            }
        };

        refreshHistory();
        const interval = setInterval(refreshHistory, 3000);
        window.addEventListener('assholihin-history-change', refreshHistory);
        window.addEventListener('storage', refreshHistory);
        return () => {
            clearInterval(interval);
            window.removeEventListener('assholihin-history-change', refreshHistory);
            window.removeEventListener('storage', refreshHistory);
        };
    }, [activeTab]);

    const [banks, setBanks] = useState(() => {
        try {
            const saved = localStorage.getItem('assholihin_donor_banks');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [newBank, setNewBank] = useState({
        bankName: 'Bank Syariah Indonesia (BSI)',
        accountNumber: '',
        accountHolder: ''
    });

    useEffect(() => {
        localStorage.setItem('assholihin_donor_banks', JSON.stringify(banks));
    }, [banks]);

    // Ambil daftar akun terdaftar di localStorage (dengan default demo account)
    const getRegisteredUsers = () => {
        const defaultUsers = [
            {
                id: 101,
                fullName: 'H. Ahmad Syarifuddin',
                displayName: 'H. Ahmad Syarifuddin',
                email: 'donatur@panti.com',
                whatsapp: '081234567890',
                password: 'password',
                birthDate: '1985-05-15',
                address: 'Candimulyo, Jombang',
                alwaysAnonymous: false,
                waReceiptNotification: true,
                monthlyLpjEmail: true
            },
            {
                id: 102,
                fullName: 'Ibu Hj. Siti Aminah',
                displayName: 'Hamba Allah',
                email: 'donatur@gmail.com',
                whatsapp: '081298765432',
                password: 'password',
                birthDate: '1990-08-20',
                address: 'Jombang Kota',
                alwaysAnonymous: true,
                waReceiptNotification: true,
                monthlyLpjEmail: true
            }
        ];

        try {
            const raw = localStorage.getItem('assholihin_registered_users');
            if (!raw) {
                localStorage.setItem('assholihin_registered_users', JSON.stringify(defaultUsers));
                return defaultUsers;
            }
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed) || parsed.length === 0) {
                localStorage.setItem('assholihin_registered_users', JSON.stringify(defaultUsers));
                return defaultUsers;
            }
            // Pastikan akun default selalu ada
            defaultUsers.forEach(def => {
                if (!parsed.some(p => p.email.toLowerCase() === def.email.toLowerCase())) {
                    parsed.push(def);
                }
            });
            return parsed;
        } catch {
            return defaultUsers;
        }
    };

    const handleRegisterSubmit = (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthSuccess('');

        if (registerData.password.length < 6) {
            setAuthError('Kata sandi minimal 6 karakter.');
            return;
        }
        if (registerData.password !== registerData.confirmPassword) {
            setAuthError('Konfirmasi kata sandi tidak cocok.');
            return;
        }

        const users = getRegisteredUsers();
        const exists = users.find(
            (u) =>
                u.email.toLowerCase() === registerData.email.toLowerCase() ||
                u.whatsapp === registerData.whatsapp
        );

        if (exists) {
            setAuthError('Email atau Nomor WhatsApp sudah terdaftar. Silakan masuk (Login).');
            return;
        }

        const newUser = {
            id: Date.now(),
            fullName: registerData.fullName,
            displayName: registerData.alwaysAnonymous ? 'Hamba Allah' : registerData.fullName,
            email: registerData.email,
            whatsapp: registerData.whatsapp,
            password: registerData.password,
            birthDate: '',
            address: '',
            alwaysAnonymous: registerData.alwaysAnonymous,
            waReceiptNotification: true,
            monthlyLpjEmail: true
        };

        const updatedUsers = [...users, newUser];
        localStorage.setItem('assholihin_registered_users', JSON.stringify(updatedUsers));
        localStorage.setItem('assholihin_auth_session', JSON.stringify(newUser));
        setAuthUser(newUser);
        window.dispatchEvent(new Event('assholihin-auth-change'));
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setAuthError('');
        setAuthSuccess('');

        const users = getRegisteredUsers();
        const found = users.find(
            (u) =>
                (u.email.toLowerCase() === loginData.identifier.toLowerCase() ||
                    u.whatsapp === loginData.identifier) &&
                u.password === loginData.password
        );

        if (!found) {
            setAuthError(
                'Akun tidak ditemukan atau kata sandi salah. Jika belum memiliki akun, silakan klik tab "Daftar Akun Baru".'
            );
            return;
        }

        localStorage.setItem('assholihin_auth_session', JSON.stringify(found));
        setAuthUser(found);
        window.dispatchEvent(new Event('assholihin-auth-change'));
    };

    const handleLogout = () => {
        localStorage.removeItem('assholihin_auth_session');
        setAuthUser(null);
        window.dispatchEvent(new Event('assholihin-auth-change'));
    };

    const handleProfileSave = (e) => {
        e.preventDefault();
        if (!authUser) return;

        // Simpan ke session aktif & daftar user
        localStorage.setItem('assholihin_auth_session', JSON.stringify(authUser));
        const users = getRegisteredUsers().map((u) => (u.id === authUser.id ? authUser : u));
        localStorage.setItem('assholihin_registered_users', JSON.stringify(users));
        window.dispatchEvent(new Event('assholihin-auth-change'));

        setSavedMessage('Data profil dan pengaturan berhasil diperbarui.');
        setTimeout(() => setSavedMessage(''), 3500);
    };

    const handleAddBank = (e) => {
        e.preventDefault();
        if (!newBank.accountNumber || !newBank.accountHolder) return;
        const entry = {
            id: Date.now(),
            bankName: newBank.bankName,
            accountNumber: newBank.accountNumber,
            accountHolder: newBank.accountHolder,
            isPrimary: banks.length === 0,
            purpose: 'Rekening Terdaftar Donatur (Kafalah & Refund)'
        };
        setBanks([...banks, entry]);
        setNewBank({ bankName: 'Bank Syariah Indonesia (BSI)', accountNumber: '', accountHolder: '' });
    };

    const handleRemoveBank = (id) => {
        setBanks(banks.filter((b) => b.id !== id));
    };

    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val);
    };

    const navTabs = [
        { id: 'profile', label: 'Data Profil & Identitas', icon: UserCircleIcon },
        { id: 'banks', label: 'No. Rekening Tersimpan', icon: CreditCardIcon },
        { id: 'settings', label: 'Pengaturan Web & Privasi', icon: Cog6ToothIcon },
        { id: 'history', label: 'Riwayat & E-Kwitansi', icon: ClockIcon }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-surface">
            <Navbar onDonateClick={() => setIsDonateOpen(true)} />

            <main className="flex-1 py-10 lg:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {!authUser ? (
                        /* BELUM LOGIN: TAMPILKAN HALAMAN MASUK / DAFTAR AKUN DONATUR */
                        <div className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-12 rounded-2xl bg-white border border-slate-200/90 shadow-elevated overflow-hidden">
                                {/* Left Info Column (5 Cols) */}
                                <div className="lg:col-span-5 bg-primary p-6 sm:p-8 text-white flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-semibold">
                                            <ShieldCheckIcon className="w-4 h-4" />
                                            <span>Portal Resmi Muzakki & Donatur</span>
                                        </div>
                                        <h1 className="text-2xl font-heading font-bold leading-snug">
                                            Akun Donatur Panti Asuhan As-Sholihin
                                        </h1>
                                        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                                            Daftarkan akun Anda untuk kemudahan mengelola profil donatur, menyimpan nomor rekening, mengatur privasi nama (Hamba Allah), serta mengunduh E-Kwitansi resmi setiap berdonasi.
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-white/15 space-y-2.5 text-xs text-emerald-100">
                                        <div className="flex items-center gap-2">
                                            <CheckBadgeIcon className="w-4 h-4 text-emerald-300 shrink-0" />
                                            <span>Simpan Data Profil & Rekening Bank</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckBadgeIcon className="w-4 h-4 text-emerald-300 shrink-0" />
                                            <span>Pengaturan Privasi Publik (Hamba Allah)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckBadgeIcon className="w-4 h-4 text-emerald-300 shrink-0" />
                                            <span>Arsip Riwayat Donasi & Laporan E-LPJ</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Auth Form Column (7 Cols) */}
                                <div className="lg:col-span-7 p-6 sm:p-8">
                                    {/* Mode Switch Tabs */}
                                    <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAuthMode('login');
                                                setAuthError('');
                                            }}
                                            className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                authMode === 'login'
                                                    ? 'bg-white text-primary shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <KeyIcon className="w-4 h-4" />
                                            <span>Masuk (Login)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setAuthMode('register');
                                                setAuthError('');
                                            }}
                                            className={`py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
                                                authMode === 'register'
                                                    ? 'bg-white text-primary shadow-2xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            <UserPlusIcon className="w-4 h-4" />
                                            <span>Daftar Akun Baru</span>
                                        </button>
                                    </div>

                                    {authError && (
                                        <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                                            {authError}
                                        </div>
                                    )}

                                    {authSuccess && (
                                        <div className="mb-5 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                                            {authSuccess}
                                        </div>
                                    )}

                                    {authMode === 'login' ? (
                                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Masuk ke Akun Donatur
                                                </h2>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Masukkan Email atau Nomor WhatsApp yang telah Anda daftarkan.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                    Email atau Nomor WhatsApp
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={loginData.identifier}
                                                    onChange={(e) =>
                                                        setLoginData({ ...loginData, identifier: e.target.value })
                                                    }
                                                    placeholder="Contoh: 081234567890 atau nama@email.com"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                    Kata Sandi (Password)
                                                </label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={loginData.password}
                                                    onChange={(e) =>
                                                        setLoginData({ ...loginData, password: e.target.value })
                                                    }
                                                    placeholder="Masukkan kata sandi Anda"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full btn-primary py-3 justify-center"
                                            >
                                                <LockClosedIcon className="w-4 h-4" />
                                                <span>Masuk ke Portal Donatur</span>
                                            </button>

                                            <p className="text-xs text-center text-slate-500 pt-2">
                                                Belum punya akun donatur?{' '}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAuthMode('register');
                                                        setAuthError('');
                                                    }}
                                                    className="font-bold text-primary hover:underline"
                                                >
                                                    Daftar Akun Baru di sini
                                                </button>
                                            </p>
                                        </form>
                                    ) : (
                                        <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                            <div>
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Pendaftaran Akun Donatur Baru
                                                </h2>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Lengkapi data di bawah ini untuk membuat akun donatur resmi.
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                    Nama Lengkap (Sesuai KTP)
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={registerData.fullName}
                                                    onChange={(e) =>
                                                        setRegisterData({ ...registerData, fullName: e.target.value })
                                                    }
                                                    placeholder="Contoh: Ahmad Fauzi"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                        Nomor WhatsApp Aktif
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={registerData.whatsapp}
                                                        onChange={(e) =>
                                                            setRegisterData({
                                                                ...registerData,
                                                                whatsapp: e.target.value
                                                            })
                                                        }
                                                        placeholder="0812xxxxxxxx"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                        Alamat Email
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={registerData.email}
                                                        onChange={(e) =>
                                                            setRegisterData({ ...registerData, email: e.target.value })
                                                        }
                                                        placeholder="nama@email.com"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                        Buat Kata Sandi
                                                    </label>
                                                    <input
                                                        type="password"
                                                        required
                                                        minLength={6}
                                                        value={registerData.password}
                                                        onChange={(e) =>
                                                            setRegisterData({
                                                                ...registerData,
                                                                password: e.target.value
                                                            })
                                                        }
                                                        placeholder="Minimal 6 karakter"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                        Ulangi Kata Sandi
                                                    </label>
                                                    <input
                                                        type="password"
                                                        required
                                                        minLength={6}
                                                        value={registerData.confirmPassword}
                                                        onChange={(e) =>
                                                            setRegisterData({
                                                                ...registerData,
                                                                confirmPassword: e.target.value
                                                            })
                                                        }
                                                        placeholder="Ketik ulang sandi"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <label className="flex items-center gap-2.5 pt-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={registerData.alwaysAnonymous}
                                                    onChange={(e) =>
                                                        setRegisterData({
                                                            ...registerData,
                                                            alwaysAnonymous: e.target.checked
                                                        })
                                                    }
                                                    className="rounded border-slate-300 text-primary focus:ring-primary"
                                                />
                                                <span className="text-xs text-slate-600">
                                                    Aktifkan mode privasi <strong>Hamba Allah</strong> secara default saat berdonasi
                                                </span>
                                            </label>

                                            <button
                                                type="submit"
                                                className="w-full btn-primary py-3 justify-center"
                                            >
                                                <UserPlusIcon className="w-4 h-4" />
                                                <span>Buat Akun & Masuk Sekarang</span>
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* SUDAH LOGIN: TAMPILKAN DASHBOARD AKUN DONATUR */
                        <>
                            {/* Top User Banner */}
                            <div className="card-surface p-6 sm:p-8 mb-8 bg-white">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-primary text-white font-heading font-bold text-xl flex items-center justify-center shrink-0">
                                            {authUser.fullName
                                                ? authUser.fullName.substring(0, 2).toUpperCase()
                                                : 'DN'}
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                                                    {authUser.fullName}
                                                </h1>
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckBadgeIcon className="w-3.5 h-3.5" />
                                                    <span>Akun Donatur Aktif</span>
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                                Tampilan Publik:{' '}
                                                <strong className="text-slate-700">
                                                    {authUser.alwaysAnonymous
                                                        ? 'Hamba Allah (Mode Anonim Aktif)'
                                                        : authUser.fullName}
                                                </strong>{' '}
                                                • WhatsApp: {authUser.whatsapp}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsDonateOpen(true)}
                                            className="btn-primary"
                                        >
                                            + Salurkan Donasi Baru
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className="btn-outline text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        >
                                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                            <span>Keluar Akun</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Workspace Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Sidebar Menu (3 Cols) */}
                                <div className="lg:col-span-3 card-surface p-3 space-y-1 bg-white">
                                    {navTabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                type="button"
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-xs sm:text-sm font-semibold transition-colors text-left ${
                                                    isActive
                                                        ? 'bg-primary text-white'
                                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <Icon className="w-5 h-5 shrink-0" />
                                                <span>{tab.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Content Panel (9 Cols) */}
                                <div className="lg:col-span-9 card-surface p-6 sm:p-8 bg-white">
                                    {savedMessage && (
                                        <div className="mb-6 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2">
                                            <ShieldCheckIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                                            <span>{savedMessage}</span>
                                        </div>
                                    )}

                                    {/* TAB 1: DATA PROFIL */}
                                    {activeTab === 'profile' && (
                                        <form onSubmit={handleProfileSave} className="space-y-6">
                                            <div className="border-b border-slate-100 pb-4">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Data Profil & Identitas Donatur
                                                </h2>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Informasi ini digunakan untuk pengisian otomatis saat checkout donasi dan penerbitan E-Kwitansi resmi.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Nama Lengkap (Sesuai KTP)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={authUser.fullName}
                                                        onChange={(e) =>
                                                            setAuthUser({ ...authUser, fullName: e.target.value })
                                                        }
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Nama Alias di Papan Transparansi Publik
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={authUser.displayName || ''}
                                                        onChange={(e) =>
                                                            setAuthUser({ ...authUser, displayName: e.target.value })
                                                        }
                                                        placeholder="Contoh: Hamba Allah"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Nomor WhatsApp Aktif (Penerima E-Kwitansi)
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={authUser.whatsapp}
                                                        onChange={(e) =>
                                                            setAuthUser({ ...authUser, whatsapp: e.target.value })
                                                        }
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Alamat Email Resmi
                                                    </label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={authUser.email}
                                                        onChange={(e) =>
                                                            setAuthUser({ ...authUser, email: e.target.value })
                                                        }
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Tanggal Lahir (Untuk Jadwal Doa Milad Santri)
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={authUser.birthDate || ''}
                                                        onChange={(e) =>
                                                            setAuthUser({ ...authUser, birthDate: e.target.value })
                                                        }
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                        Alamat Domisili
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={authUser.address || ''}
                                                        onChange={(e) =>
                                                            setAuthUser({ ...authUser, address: e.target.value })
                                                        }
                                                        placeholder="Kota / Kabupaten domisili Anda"
                                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <button type="submit" className="btn-primary">
                                                    Simpan Perubahan Profil
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* TAB 2: NOMOR REKENING TERSIMPAN */}
                                    {activeTab === 'banks' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-slate-100 pb-4">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Data Rekening Bank & Metode Pembayaran Donatur
                                                </h2>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Digunakan untuk pencocokan mutasi transfer manual, pengingat Kafalah Orang Tua Asuh bulanan, serta rekening tujuan sah apabila terjadi pengajuan pengembalian kelebihan transfer (refund).
                                                </p>
                                            </div>

                                            {banks.length === 0 ? (
                                                <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs sm:text-sm text-slate-500">
                                                    Belum ada nomor rekening bank yang disimpan. Tambahkan rekening Anda pada formulir di bawah ini.
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    {banks.map((b) => (
                                                        <div
                                                            key={b.id}
                                                            className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
                                                        >
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-bold text-slate-900">
                                                                        {b.bankName}
                                                                    </span>
                                                                    {b.isPrimary && (
                                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                                                            Rekening Utama
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm font-mono font-semibold text-slate-700 mt-1">
                                                                    No. Rek: {b.accountNumber} — a.n. {b.accountHolder}
                                                                </p>
                                                                <p className="text-xs text-slate-500 mt-0.5">{b.purpose}</p>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveBank(b.id)}
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 self-start sm:self-center"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                                <span>Hapus</span>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add New Bank Form */}
                                            <form onSubmit={handleAddBank} className="pt-6 border-t border-slate-100 space-y-4">
                                                <h3 className="text-sm font-bold text-slate-900">
                                                    + Tambah Nomor Rekening Baru
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                            Nama Bank
                                                        </label>
                                                        <select
                                                            value={newBank.bankName}
                                                            onChange={(e) =>
                                                                setNewBank({ ...newBank, bankName: e.target.value })
                                                            }
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900"
                                                        >
                                                            <option value="Bank Syariah Indonesia (BSI)">
                                                                Bank Syariah Indonesia (BSI)
                                                            </option>
                                                            <option value="Bank Central Asia (BCA)">
                                                                Bank Central Asia (BCA)
                                                            </option>
                                                            <option value="Bank Mandiri">Bank Mandiri</option>
                                                            <option value="Bank Rakyat Indonesia (BRI)">
                                                                Bank Rakyat Indonesia (BRI)
                                                            </option>
                                                            <option value="Bank Negara Indonesia (BNI)">
                                                                Bank Negara Indonesia (BNI)
                                                            </option>
                                                            <option value="Bank Jatim / Lainnya">
                                                                Bank Jatim / Lainnya
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                            Nomor Rekening
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={newBank.accountNumber}
                                                            onChange={(e) =>
                                                                setNewBank({
                                                                    ...newBank,
                                                                    accountNumber: e.target.value
                                                                })
                                                            }
                                                            placeholder="Contoh: 7148899231"
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 font-mono"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                                                            Nama Pemilik Rekening
                                                        </label>
                                                        <input
                                                            type="text"
                                                            required
                                                            value={newBank.accountHolder}
                                                            onChange={(e) =>
                                                                setNewBank({
                                                                    ...newBank,
                                                                    accountHolder: e.target.value
                                                                })
                                                            }
                                                            placeholder="Sesuai buku tabungan"
                                                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900"
                                                        />
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn-outline">
                                                    <PlusIcon className="w-4 h-4" />
                                                    <span>Simpan Rekening</span>
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    {/* TAB 3: PENGATURAN WEB & PRIVASI */}
                                    {activeTab === 'settings' && (
                                        <form onSubmit={handleProfileSave} className="space-y-6">
                                            <div className="border-b border-slate-100 pb-4">
                                                <h2 className="text-lg font-bold text-slate-900">
                                                    Pengaturan Akun Web & Privasi Donatur
                                                </h2>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    Atur bagaimana identitas Anda ditampilkan pada portal transparansi publik dan bagaimana laporan dikirimkan.
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50/60">
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-900 block">
                                                            Selalu Samarkan Nama Saya (Mode Hamba Allah Default)
                                                        </span>
                                                        <span className="text-xs text-slate-500 mt-0.5 block">
                                                            Setiap kali Anda berdonasi, nama Anda di papan transparansi publik otomatis ditulis sebagai &ldquo;Hamba Allah&rdquo;.
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={!!authUser.alwaysAnonymous}
                                                        onChange={(e) =>
                                                            setAuthUser({
                                                                ...authUser,
                                                                alwaysAnonymous: e.target.checked
                                                            })
                                                        }
                                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                </label>

                                                <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50/60">
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-900 block">
                                                            Kirim E-Kwitansi & Doa Santri Otomatis via WhatsApp
                                                        </span>
                                                        <span className="text-xs text-slate-500 mt-0.5 block">
                                                            Terima bukti pembayaran sah ber-QR Code beberapa detik setelah pembayaran QRIS / Virtual Account terverifikasi.
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={authUser.waReceiptNotification !== false}
                                                        onChange={(e) =>
                                                            setAuthUser({
                                                                ...authUser,
                                                                waReceiptNotification: e.target.checked
                                                            })
                                                        }
                                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                </label>

                                                <label className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50/60">
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-900 block">
                                                            Berlangganan Laporan Keuangan Bulanan (E-LPJ PDF)
                                                        </span>
                                                        <span className="text-xs text-slate-500 mt-0.5 block">
                                                            Kirimkan rekapitulasi pemasukan dan bukti nota belanja operasional panti setiap awal bulan ke email saya.
                                                        </span>
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={authUser.monthlyLpjEmail !== false}
                                                        onChange={(e) =>
                                                            setAuthUser({
                                                                ...authUser,
                                                                monthlyLpjEmail: e.target.checked
                                                            })
                                                        }
                                                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                </label>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100">
                                                <button type="submit" className="btn-primary">
                                                    Simpan Pengaturan Privasi
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    {/* TAB 4: RIWAYAT DONASI & E-KWITANSI */}
                                    {activeTab === 'history' && (
                                        <div className="space-y-6">
                                            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                <div>
                                                    <h2 className="text-lg font-bold text-slate-900">
                                                        Riwayat Donasi & Unduh E-Kwitansi Resmi
                                                    </h2>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        Daftar kontribusi Anda yang telah tercatat di Buku Kas Panti Asuhan As-Sholihin.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                            <th className="py-3 pr-4">No. Referensi</th>
                                                            <th className="py-3 px-4">Tanggal</th>
                                                            <th className="py-3 px-4">Program Akad</th>
                                                            <th className="py-3 px-4">Nominal</th>
                                                            <th className="py-3 px-4">Metode</th>
                                                            <th className="py-3 px-4">Status</th>
                                                            <th className="py-3 pl-4 text-right">E-Kwitansi</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                                        {historyList.map((item) => {
                                                            const isPaid = (item.status || '').toLowerCase().includes('berhasil') || (item.status || '').toLowerCase().includes('settlement');
                                                            const isFailed = (item.status || '').toLowerCase().includes('batal') || (item.status || '').toLowerCase().includes('kedaluwarsa');
                                                            return (
                                                                <tr key={item.id} className="hover:bg-slate-50/70">
                                                                    <td className="py-3.5 pr-4 font-mono font-semibold text-slate-800">
                                                                        {item.id}
                                                                    </td>
                                                                    <td className="py-3.5 px-4 text-slate-600">{item.date}</td>
                                                                    <td className="py-3.5 px-4 font-medium text-slate-900">
                                                                        {item.program}
                                                                    </td>
                                                                    <td className="py-3.5 px-4 font-bold text-primary tabular-nums">
                                                                        {formatIDR(item.amount)}
                                                                    </td>
                                                                    <td className="py-3.5 px-4 text-slate-600">
                                                                        {item.method}
                                                                    </td>
                                                                    <td className="py-3.5 px-4">
                                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                                            isPaid
                                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                                : isFailed
                                                                                ? 'bg-red-50 text-red-700 border border-red-200'
                                                                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                        }`}>
                                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                                isPaid ? 'bg-emerald-500' : isFailed ? 'bg-red-500' : 'bg-amber-500 animate-pulse'
                                                                            }`} />
                                                                            {item.status || 'Menunggu Pembayaran'}
                                                                        </span>
                                                                    </td>
                                                                    <td className="py-3.5 pl-4 text-right">
                                                                        <a
                                                                            href={`/success?order_id=${item.id}`}
                                                                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                                        >
                                                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                                                            <span>Lihat / Cetak PDF</span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
            <DonationModal isOpen={isDonateOpen} setIsOpen={setIsDonateOpen} />
        </div>
    );
}
