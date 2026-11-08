
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Payment Methods Data - Based on DOKU Checkout Official Documentation
// https://developers.doku.com/accept-payments/doku-checkout/supported-payment-methods
const paymentMethods = [
    // Virtual Accounts
    {
        id: 'VIRTUAL_ACCOUNT_BCA',
        name: 'BCA Virtual Account',
        type: 'va',
        category: 'Virtual Account',
        image: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg',
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'VIRTUAL_ACCOUNT_BANK_MANDIRI',
        name: 'Mandiri Virtual Account',
        type: 'va',
        category: 'Virtual Account',
        image: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg',
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'VIRTUAL_ACCOUNT_BNI',
        name: 'BNI Virtual Account',
        type: 'va',
        category: 'Virtual Account',
        image: `${import.meta.env.BASE_URL}img/bni.png`,
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'VIRTUAL_ACCOUNT_BRI',
        name: 'BRI Virtual Account',
        type: 'va',
        category: 'Virtual Account',
        image: `${import.meta.env.BASE_URL}img/banks/bri.png`,
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'VIRTUAL_ACCOUNT_BANK_PERMATA',
        name: 'Permata Virtual Account',
        type: 'va',
        category: 'Virtual Account',
        image: `${import.meta.env.BASE_URL}img/banks/permata.jpg`,
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'VIRTUAL_ACCOUNT_BANK_CIMB',
        name: 'CIMB Niaga Virtual Account',
        type: 'va',
        category: 'Virtual Account',
        image: `${import.meta.env.BASE_URL}img/banks/cimb.jpg`,
        desc: 'Verifikasi Otomatis'
    },

    // E-Wallets
    {
        id: 'QRIS',
        name: 'QRIS',
        type: 'qris',
        category: 'QRIS',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/1200px-Logo_QRIS.svg.png',
        desc: 'Semua E-wallet & Bank'
    },
    {
        id: 'EMONEY_OVO',
        name: 'OVO',
        type: 'ewallet',
        category: 'E-wallet',
        image: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Logo_ovo_purple.svg',
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'EMONEY_SHOPEE_PAY',
        name: 'ShopeePay',
        type: 'ewallet',
        category: 'E-wallet',
        image: 'https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg',
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'EMONEY_DANA',
        name: 'DANA',
        type: 'ewallet',
        category: 'E-wallet',
        image: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg',
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'EMONEY_LINKAJA',
        name: 'LinkAja',
        type: 'ewallet',
        category: 'E-wallet',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/LinkAja.svg/640px-LinkAja.svg.png',
        desc: 'Verifikasi Otomatis'
    },
    {
        id: 'EMONEY_GOPAY',
        name: 'GoPay',
        type: 'ewallet',
        category: 'E-wallet',
        image: 'https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg',
        desc: 'Verifikasi Otomatis'
    },

    // Credit Card
    {
        id: 'CREDIT_CARD',
        name: 'Credit Card',
        type: 'credit_card',
        category: 'Credit Card',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/640px-Visa_Inc._logo.svg.png',
        desc: 'Visa, Mastercard, JCB'
    },

    // Paylater
    {
        id: 'PEER_TO_PEER_KREDIVO',
        name: 'Kredivo',
        type: 'paylater',
        category: 'Paylater',
        image: 'https://assets.kredivo.com/brand/Kredivo-Logo-Horizontal-Teal.svg',
        desc: 'Cicilan 0%'
    },
    {
        id: 'PEER_TO_PEER_AKULAKU',
        name: 'Akulaku',
        type: 'paylater',
        category: 'Paylater',
        image: 'https://s3.ap-southeast-1.amazonaws.com/assets.akulaku.com/img/logo-akulaku.png',
        desc: 'Cicilan 0%'
    },

    // Convenience Store
    {
        id: 'ONLINE_TO_OFFLINE_ALFA',
        name: 'Alfamart',
        type: 'convenience',
        category: 'Convenience Store',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Alfamart_logo.svg/640px-Alfamart_logo.svg.png',
        desc: 'Bayar di toko'
    },
    {
        id: 'ONLINE_TO_OFFLINE_INDOMARET',
        name: 'Indomaret',
        type: 'convenience',
        category: 'Convenience Store',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Indomaret_logo.svg/640px-Indomaret_logo.svg.png',
        desc: 'Bayar di toko'
    },
];

export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Default data logic
    const { donationData } = location.state || {
        donationData: {
            nama: 'Hamba Allah',
            email: '-',
            nominal: 0,
            pesan: ''
        }
    };

    const [selectedMethod, setSelectedMethod] = useState('bca');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate pseudo-unique code
    const uniqueCode = Math.floor(Math.random() * 900) + 100;
    const totalAmount = parseInt(donationData.nominal) + uniqueCode;

    const handlePayment = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                ...donationData,
                metode_pembayaran: selectedMethod,
            };

            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

            // Call DOKU create payment endpoint
            const response = await axios.post(`${baseUrl}/landing/payment/create`, payload);

            if (response.data.success) {
                // Redirect to Pending Page instead of direct DOKU
                navigate(`/pending?order_id=${response.data.data.order_id}`, {
                    state: {
                        payment_url: response.data.data.payment_url
                    }
                });
            } else {
                alert(response.data.message || "Gagal membuat pembayaran. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Payment error:", error);

            let errorMessage = "Terjadi kesalahan sistem. Mohon coba lagi nanti.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            alert(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // If accessed directly without data, redirect
    if (!location.state) {
        // We can render a loading or redirecting state
        setTimeout(() => navigate('/'), 1000);
        return <div className="p-10 text-center">Redirecting...</div>;
    }

    return (
        <div className="bg-slate-50 text-slate-900 font-body antialiased min-h-screen">
            {/* Navbar */}
            <nav className="sticky top-0 left-0 right-0 z-50 glass-nav">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
                            <div className="bg-center bg-no-repeat bg-contain rounded-xl size-11 shadow-md border border-white/50 bg-white" style={{ backgroundImage: `url("${import.meta.env.BASE_URL}img/logo.png")` }}></div>
                            <div className="flex flex-col">
                                <span className="font-heading font-bold text-2xl text-primary leading-none">Assholihin</span>
                                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-secondary">Foundation</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined">help</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="w-full pb-20 batik-bg min-h-[calc(100vh-80px)]">
                <div className="max-w-6xl mx-auto px-4 pt-12">
                    <div className="mb-10 text-center lg:text-left">
                        <h1 className="font-heading text-4xl font-bold text-primary-dark mb-2">Pilih Metode Pembayaran</h1>
                        <p className="text-slate-500">Silakan pilih metode pembayaran yang paling memudahkan Anda</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Sidebar (Order 2 on mobile, Order 1 on LG - based on provided HTML structure it's order-2 lg:order-1) */}
                        <aside className="lg:col-span-4 order-1 lg:order-1">
                            <div className="glass-card rounded-3xl p-6 shadow-glass border border-slate-200/50 sticky top-32">
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">receipt_long</span>
                                    Ringkasan Donasi
                                </h3>

                                <div className="space-y-4 mb-6">

                                    <div className="pb-4 border-b border-slate-100">
                                        <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Informasi Donatur</p>
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                                {donationData.nama.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700">{donationData.nama}</p>
                                                <p className="text-xs text-slate-500">{donationData.email || '-'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 rounded-2xl p-5 mb-8">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm text-slate-600">Nominal Donasi</span>
                                        <span className="font-bold text-slate-800">{formatCurrency(donationData.nominal)}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-xs text-slate-500">Kode Unik</span>
                                        <span className="text-xs font-mono text-slate-500">+{uniqueCode}</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-3 border-t border-primary/10">
                                        <span className="font-bold text-slate-800">Total Pembayaran</span>
                                        <span className="text-xl font-heading font-bold text-primary">{formatCurrency(totalAmount)}</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-[11px] text-amber-700 leading-relaxed">
                                    <span className="material-symbols-outlined text-[16px]">info</span>
                                    <p>Pembayaran akan diverifikasi secara otomatis. Pastikan nominal yang Anda transfer sesuai hingga 3 digit terakhir.</p>
                                </div>
                            </div>
                        </aside>

                        {/* Payment Options (Order 1 mobile, Order 2 lg) */}
                        <div className="lg:col-span-8 order-2 lg:order-2">
                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                        Transfer Bank (Virtual Account)
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {paymentMethods.filter(m => m.type === 'va').map(method => (
                                            <label key={method.id} className="group relative flex items-center p-4 bg-white rounded-2xl border-2 border-slate-100 cursor-pointer hover:border-primary/30 transition-all duration-300">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method.id}
                                                    checked={selectedMethod === method.id}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="sr-only peer"
                                                />
                                                <div className="absolute inset-0 rounded-2xl peer-checked:border-primary peer-checked:bg-primary/[0.02] transition-all"></div>
                                                <div className="relative flex items-center w-full gap-4">
                                                    <div className="w-14 h-10 bg-slate-50 rounded flex items-center justify-center p-2 border border-slate-100">
                                                        <img src={method.image} alt={method.name} className="h-full w-full object-contain" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-800 text-sm">{method.name}</p>
                                                        <p className="text-[10px] text-slate-400">{method.desc}</p>
                                                    </div>
                                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                        {selectedMethod === method.id && <div className="size-2 rounded-full bg-white"></div>}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-sm font-bold text-slate-500 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                        E-Wallet & QRIS
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {paymentMethods.filter(m => m.type === 'ewallet' || m.type === 'qris').map(method => (
                                            <label key={method.id} className="group relative flex items-center p-4 bg-white rounded-2xl border-2 border-slate-100 cursor-pointer hover:border-primary/30 transition-all duration-300">
                                                <input
                                                    type="radio"
                                                    name="payment_method"
                                                    value={method.id}
                                                    checked={selectedMethod === method.id}
                                                    onChange={(e) => setSelectedMethod(e.target.value)}
                                                    className="sr-only peer"
                                                />
                                                <div className="absolute inset-0 rounded-2xl peer-checked:border-primary peer-checked:bg-primary/[0.02] transition-all"></div>
                                                <div className="relative flex items-center w-full gap-4">
                                                    <div className="w-14 h-10 bg-slate-50 rounded flex items-center justify-center p-2 border border-slate-100">
                                                        <img src={method.image} alt={method.name} className="h-full w-full object-contain" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-bold text-slate-800 text-sm">{method.name}</p>
                                                        <p className="text-[10px] text-slate-400">{method.desc}</p>
                                                    </div>
                                                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                        {selectedMethod === method.id && <div className="size-2 rounded-full bg-white"></div>}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handlePayment}
                                    disabled={isSubmitting}
                                    style={{ background: 'linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #ca8a04 100%)' }}
                                    className="flex-1 text-white px-8 py-5 rounded-2xl font-bold shadow-lg shadow-secondary/30 transition-all hover:scale-[1.02] hover:shadow-gold-glow flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <span>Memproses...</span>
                                    ) : (
                                        <>
                                            <span className="text-lg">Lanjutkan Pembayaran</span>
                                            <span className="material-symbols-outlined">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-8 py-5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
                                >
                                    Kembali
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-100 py-10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-primary text-xl">shield_with_heart</span>
                        <p className="text-sm font-semibold text-slate-700">Pembayaran Terenkripsi & Aman</p>
                    </div>
                    <p className="text-xs text-slate-400">© 2023 Yayasan Panti Asuhan Assholihin. Terdaftar resmi di Kementerian Sosial RI.</p>
                </div>
            </footer>
        </div>
    );
}
