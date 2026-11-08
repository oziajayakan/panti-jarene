import { useState } from 'react';
import {
    DocumentDuplicateIcon,
    CheckIcon,
    QrCodeIcon
} from '@heroicons/react/24/outline';

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
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (id, text) => {
        const cleanNumber = text.replace(/[^0-9]/g, '');
        navigator.clipboard.writeText(cleanNumber);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

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

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Left: 3 Compact Bank Cards */}
                    <div className="lg:col-span-7 space-y-3 flex flex-col justify-between">
                        {OFFICIAL_BANKS.map((bank) => {
                            const isCopied = copiedId === bank.id;
                            return (
                                <div
                                    key={bank.id}
                                    className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                >
                                    <div>
                                        <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
                                            {bank.badge} • {bank.bankName}
                                        </span>
                                        <p className="text-lg font-mono font-extrabold text-slate-900 mt-0.5">
                                            {bank.accountNumber}
                                        </p>
                                        <p className="text-xs text-slate-500">a.n. {bank.accountHolder}</p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleCopy(bank.id, bank.accountNumber)}
                                        className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all shrink-0 ${
                                            isCopied
                                                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        {isCopied ? (
                                            <>
                                                <CheckIcon className="w-4 h-4 text-emerald-600" />
                                                <span>Tersalin</span>
                                            </>
                                        ) : (
                                            <>
                                                <DocumentDuplicateIcon className="w-4 h-4 text-slate-500" />
                                                <span>Salin No. Rek</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Compact QRIS Box */}
                    <div className="lg:col-span-5 card-surface p-5 flex flex-col items-center justify-center text-center bg-mint/60">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-3">
                            <QrCodeIcon className="w-4 h-4" />
                            <span>QRIS Nasional (NMID: ID1026507480998)</span>
                        </div>
                        <img
                            src={`${import.meta.env.BASE_URL}img/qris_assholihin.jpg`}
                            alt="QRIS LKSA As Sholihin"
                            className="w-48 h-auto rounded-xl border border-slate-200 bg-white p-2 shadow-2xs"
                        />
                        <p className="text-xs font-semibold text-slate-700 mt-3">
                            A.n. LKSA AS SHOLIHIN — Candimulyo Jombang
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
