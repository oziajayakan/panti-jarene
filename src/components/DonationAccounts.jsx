import { Component, Suspense, lazy } from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';

const Lanyard = lazy(() => import('./Lanyard'));

class LanyardErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

const OFFICIAL_BANKS = [
    {
        id: 'bsi-infaq',
        badge: 'Infaq & Sedekah',
        bankName: 'Bank Syariah Indonesia (BSI)',
        accountNumber: '7148899231',
        accountHolder: 'YAYASAN ASSHOLIHIN CANDIMULYO'
    },
    {
        id: 'bri-zakat',
        badge: 'Zakat & Beasiswa',
        bankName: 'Bank Rakyat Indonesia (BRI)',
        accountNumber: '0023-01-024891-53-8',
        accountHolder: 'LKSA PANTI ASUHAN AS SHOLIHIN'
    },
    {
        id: 'bni-wakaf',
        badge: 'Wakaf & Asrama',
        bankName: 'Bank Negara Indonesia (BNI)',
        accountNumber: '0849210345',
        accountHolder: 'YAYASAN ASSHOLIHIN JOMBANG'
    }
];

export default function DonationAccounts({ onDonateClick }) {
    return (
        <section id="rekening" className="py-12 lg:py-16 bg-white border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Rekening & QRIS Resmi
                        </span>
                        <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mt-0.5">
                            Transfer Manual atau Scan QRIS
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => onDonateClick && onDonateClick()}
                        className="btn-primary text-xs py-2.5 px-4"
                    >
                        Checkout Otomatis (VA / E-Wallet)
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* 3D Interactive Lanyard QRIS */}
                    <div className="lg:col-span-6 h-[460px] sm:h-[520px] rounded-2xl bg-gradient-to-b from-slate-50 to-mint/40 border border-slate-200/80 overflow-hidden relative flex items-center justify-center">
                        <LanyardErrorBoundary
                            fallback={
                                <div className="p-6 text-center">
                                    <img
                                        src={`${import.meta.env.BASE_URL}img/qris_assholihin.jpg`}
                                        alt="QRIS LKSA As Sholihin"
                                        className="w-56 h-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm mx-auto"
                                    />
                                </div>
                            }
                        >
                            <Suspense
                                fallback={
                                    <div className="p-6 text-center text-xs text-slate-400">
                                        Memuat kartu QRIS 3D...
                                    </div>
                                }
                            >
                                <Lanyard
                                    frontImage={`${import.meta.env.BASE_URL}img/qris_assholihin.jpg`}
                                    backImage={`${import.meta.env.BASE_URL}img/qris_assholihin.jpg`}
                                    imageFit="contain"
                                    cardColor="#ffffff"
                                    orientation="portrait"
                                    finish="glossy"
                                    cornerRadius={0.3}
                                    size={0.62}
                                    anchor="center"
                                    strapLength={0.45}
                                    strapColor="#065f46"
                                    strapWidth={0.65}
                                    metal="silver"
                                    gravity={1}
                                    damping={0.5}
                                    elasticity={0.5}
                                    breeze={0.5}
                                    interactive
                                    intro
                                />
                            </Suspense>
                        </LanyardErrorBoundary>
                    </div>

                    {/* Deskripsi Singkat */}
                    <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-primary">
                            <QrCodeIcon className="w-4 h-4" />
                            <span>QRIS Resmi Yayasan</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                            LKSA As-Sholihin Candimulyo
                        </h3>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            Scan kode QRIS pada kartu di samping menggunakan aplikasi mobile banking atau e-wallet pilihan Anda (GoPay, OVO, DANA, ShopeePay, BCA, BRI, Mandiri, BSI) untuk menyalurkan infaq, sedekah, maupun zakat secara cepat dan aman.
                        </p>
                        <p className="text-xs text-slate-400">
                            Tarik atau klik kartu QRIS 3D untuk memutarnya • NMID: ID1026507480998
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
