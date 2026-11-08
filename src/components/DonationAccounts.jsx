import { useState } from 'react';
import {
    BuildingLibraryIcon,
    QrCodeIcon,
    DocumentDuplicateIcon,
    CheckIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

const OFFICIAL_BANKS = [
    {
        id: 'bsi-infaq',
        category: 'Rekening Infaq, Sedekah & Santunan Yatim',
        bankName: 'Bank Syariah Indonesia (BSI)',
        bankCode: 'Kode Bank: 451',
        accountNumber: '7148899231',
        accountHolder: 'YAYASAN ASSHOLIHIN CANDIMULYO',
        logo: null,
        badge: 'Utama Syariah'
    },
    {
        id: 'bri-zakat',
        category: 'Rekening Zakat Maal & Kafalah Pendidikan',
        bankName: 'Bank Rakyat Indonesia (BRI)',
        bankCode: 'Kode Bank: 002',
        accountNumber: '0023-01-024891-53-8',
        accountHolder: 'LKSA PANTI ASUHAN AS SHOLIHIN',
        logo: `${import.meta.env.BASE_URL}img/banks/bri.png`,
        badge: 'Zakat & Beasiswa'
    },
    {
        id: 'bni-wakaf',
        category: 'Rekening Wakaf Asrama & Operasional Panti',
        bankName: 'Bank Negara Indonesia (BNI)',
        bankCode: 'Kode Bank: 009',
        accountNumber: '0849210345',
        accountHolder: 'YAYASAN ASSHOLIHIN JOMBANG',
        logo: `${import.meta.env.BASE_URL}img/bni.png`,
        badge: 'Wakaf & Sarana'
    }
];

export default function DonationAccounts({ onDonateClick }) {
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (id, text) => {
        const cleanNumber = text.replace(/[^0-9]/g, '');
        navigator.clipboard.writeText(cleanNumber);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
    };

    return (
        <section id="rekening" className="py-16 lg:py-24 bg-white border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-2xl mb-12">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        <BuildingLibraryIcon className="w-4 h-4" />
                        <span>Saluran Donasi Resmi Lembaga</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                        Daftar Rekening Donasi & QRIS Resmi Yayasan
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                        Pastikan seluruh transfer Zakat, Infaq, Sedekah, dan Wakaf Anda ditujukan ke rekening resmi atas nama <strong>Yayasan Assholihin / LKSA As-Sholihin</strong> atau melalui Checkout Otomatis Payment Gateway kami.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Bank Account Cards (7 Cols) */}
                    <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                        <div className="space-y-4">
                            {OFFICIAL_BANKS.map((bank) => {
                                const isCopied = copiedId === bank.id;
                                return (
                                    <div
                                        key={bank.id}
                                        className="card-surface p-5 sm:p-6 hover:border-primary/40 transition-all"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                {bank.category}
                                            </span>
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {bank.badge}
                                            </span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-base font-bold text-slate-900">
                                                        {bank.bankName}
                                                    </h3>
                                                    <span className="text-xs text-slate-400">({bank.bankCode})</span>
                                                </div>
                                                <p className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 tracking-wide">
                                                    {bank.accountNumber}
                                                </p>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    A.n. <strong className="text-slate-700">{bank.accountHolder}</strong>
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleCopy(bank.id, bank.accountNumber)}
                                                className={`px-4 py-2.5 rounded-lg text-xs font-bold border transition-all inline-flex items-center gap-1.5 self-start sm:self-center shrink-0 ${
                                                    isCopied
                                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-primary hover:text-white hover:border-primary'
                                                }`}
                                            >
                                                {isCopied ? (
                                                    <>
                                                        <CheckIcon className="w-4 h-4" />
                                                        <span>Tersalin</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DocumentDuplicateIcon className="w-4 h-4" />
                                                        <span>Salin No. Rek</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-5 rounded-xl bg-mint border border-emerald-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">
                                    Ingin Verifikasi Otomatis Tanpa Kirim Bukti Transfer?
                                </h4>
                                <p className="text-xs text-slate-600 mt-0.5">
                                    Gunakan fitur Tunaikan Donasi (Virtual Account & E-Wallet terintegrasi Buku Kas).
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onDonateClick && onDonateClick()}
                                className="btn-primary shrink-0"
                            >
                                <HeartIcon className="w-4 h-4" />
                                <span>Tunaikan Donasi Online</span>
                            </button>
                        </div>
                    </div>

                    {/* Right: Official QRIS Standar Nasional (5 Cols) */}
                    <div className="lg:col-span-5">
                        <div className="card-surface p-6 sm:p-7 h-full flex flex-col justify-between bg-surface/60">
                            <div className="text-center space-y-3">
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-primary text-xs font-bold border border-slate-200 shadow-2xs">
                                    <QrCodeIcon className="w-4 h-4" />
                                    <span>QRIS Standar Nasional (ASPI)</span>
                                </div>

                                <h3 className="text-lg font-heading font-bold text-slate-900">
                                    LKSA AS SHOLIHIN
                                </h3>
                                <p className="text-xs font-mono font-semibold text-slate-600">
                                    NMID: ID1026507480998
                                </p>

                                <div className="max-w-[260px] mx-auto p-3 bg-white rounded-2xl border border-slate-200 shadow-card">
                                    <img
                                        src={`${import.meta.env.BASE_URL}img/qris_assholihin.jpg`}
                                        alt="QRIS Resmi LKSA As-Sholihin Jombang"
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="mt-5 pt-4 border-t border-slate-200/80 text-center space-y-3">
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Menerima pembayaran dari seluruh aplikasi Mobile Banking (BSI, BCA, Mandiri, BRI, BNI) dan Dompet Digital (GoPay, OVO, DANA, ShopeePay, LinkAja).
                                </p>
                                <a
                                    href="https://wa.me/6281234567890?text=Assalamu'alaikum%20Admin%20Panti%20Asuhan%20As-Sholihin,%20saya%20ingin%20konfirmasi%20donasi%20yang%20telah%20saya%20transfer."
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-outline w-full justify-center bg-white"
                                >
                                    Konfirmasi Transfer Manual via WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

