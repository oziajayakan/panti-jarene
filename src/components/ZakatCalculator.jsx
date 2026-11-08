import { useState } from 'react';
import {
    CalculatorIcon,
    CheckCircleIcon,
    InformationCircleIcon,
    HeartIcon
} from '@heroicons/react/24/outline';

// Asumsi harga emas rata-rata Rp 1.400.000 / gram
// Nisab 85 gram emas per tahun = Rp 119.000.000 / tahun (~Rp 9.916.667 / bulan)
const GOLD_PRICE_PER_GRAM = 1400000;
const NISAB_YEARLY = 85 * GOLD_PRICE_PER_GRAM;
const NISAB_MONTHLY = Math.round(NISAB_YEARLY / 12);

export default function ZakatCalculator({ onPayZakat }) {
    const [tab, setTab] = useState('profesi'); // 'profesi' | 'maal'

    // State Zakat Penghasilan (Profesi)
    const [monthlyIncome, setMonthlyIncome] = useState('12000000');
    const [monthlyBonus, setMonthlyBonus] = useState('0');
    const [monthlyNeeds, setMonthlyNeeds] = useState('0');

    // State Zakat Maal (Tabungan / Emas / Perniagaan)
    const [savingsAsset, setSavingsAsset] = useState('150000000');
    const [goldAsset, setGoldAsset] = useState('0');
    const [shortTermDebt, setShortTermDebt] = useState('0');

    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Math.max(0, Math.round(val || 0)));
    };

    // Perhitungan Zakat Profesi
    const totalMonthlyNet =
        (Number(monthlyIncome) || 0) +
        (Number(monthlyBonus) || 0) -
        (Number(monthlyNeeds) || 0);
    const isProfesiWajib = totalMonthlyNet >= NISAB_MONTHLY;
    const zakatProfesiAmount = isProfesiWajib ? Math.round(totalMonthlyNet * 0.025) : 0;

    // Perhitungan Zakat Maal
    const totalMaalNet =
        (Number(savingsAsset) || 0) +
        (Number(goldAsset) || 0) -
        (Number(shortTermDebt) || 0);
    const isMaalWajib = totalMaalNet >= NISAB_YEARLY;
    const zakatMaalAmount = isMaalWajib ? Math.round(totalMaalNet * 0.025) : 0;

    const currentZakat = tab === 'profesi' ? zakatProfesiAmount : zakatMaalAmount;
    const currentWajib = tab === 'profesi' ? isProfesiWajib : isMaalWajib;

    const handlePayClick = () => {
        const finalNominal = currentZakat > 0 ? currentZakat : 100000;
        const programName =
            tab === 'profesi'
                ? 'Zakat Maal / Zakat Penghasilan'
                : currentWajib
                ? 'Zakat Maal / Zakat Penghasilan'
                : 'Santunan & Pendidikan Anak Yatim';

        if (onPayZakat) {
            onPayZakat({
                amount: finalNominal,
                program: programName
            });
        }
    };

    return (
        <section id="zakat" className="py-16 lg:py-24 bg-mint border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    {/* Left: Edukasi Zakat & Ketentuan Nisab (5 Cols) */}
                    <div className="lg:col-span-5 space-y-5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                            <CalculatorIcon className="w-4 h-4" />
                            <span>Layanan Muzakki Pondok Yatim & Dhuafa</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 leading-tight">
                            Kalkulator Zakat Penghasilan & Zakat Maal
                        </h2>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            Hitung kewajiban zakat Anda secara mudah dan akurat sesuai ketentuan syariat (Nisab setara 85 gram emas dengan kadar zakat <strong>2,5%</strong>). Apabila belum mencapai nisab, Anda tetap dapat menunaikannya sebagai <strong>Infaq / Sedekah Utama</strong> bagi santri yatim dan dhuafa.
                        </p>

                        <div className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-card space-y-3 text-xs sm:text-sm">
                            <div className="flex items-center gap-2 font-bold text-slate-900">
                                <InformationCircleIcon className="w-5 h-5 text-primary shrink-0" />
                                <span>Acuan Nisab Zakat (Kemenag RI / BAZNAS)</span>
                            </div>
                            <div className="space-y-2 text-slate-600 pt-1">
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span>Standar Nisab Emas:</span>
                                    <strong className="text-slate-900">85 Gram Emas / Tahun</strong>
                                </div>
                                <div className="flex justify-between py-1.5 border-b border-slate-100">
                                    <span>Estimasi Nisab Zakat Maal (Tahunan):</span>
                                    <strong className="text-primary tabular-nums">{formatIDR(NISAB_YEARLY)}</strong>
                                </div>
                                <div className="flex justify-between py-1.5">
                                    <span>Estimasi Nisab Penghasilan (Bulanan):</span>
                                    <strong className="text-primary tabular-nums">{formatIDR(NISAB_MONTHLY)} / bln</strong>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Interactive Calculator Card (7 Cols) */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-elevated overflow-hidden">
                            {/* Calculator Tabs */}
                            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
                                <button
                                    type="button"
                                    onClick={() => setTab('profesi')}
                                    className={`py-4 px-4 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
                                        tab === 'profesi'
                                            ? 'border-primary bg-white text-primary'
                                            : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    1. Zakat Penghasilan (Profesi)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTab('maal')}
                                    className={`py-4 px-4 text-xs sm:text-sm font-bold text-center border-b-2 transition-colors ${
                                        tab === 'maal'
                                            ? 'border-primary bg-white text-primary'
                                            : 'border-transparent text-slate-500 hover:text-slate-800'
                                    }`}
                                >
                                    2. Zakat Maal (Tabungan / Harta)
                                </button>
                            </div>

                            <div className="p-6 sm:p-8 space-y-5">
                                {tab === 'profesi' ? (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                Penghasilan / Gaji Bulanan (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={monthlyIncome}
                                                onChange={(e) => setMonthlyIncome(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                    Pendapatan Lain / Bonus Bulanan (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={monthlyBonus}
                                                    onChange={(e) => setMonthlyBonus(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                    Cicilan / Kebutuhan Pokok Mendesak (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={monthlyNeeds}
                                                    onChange={(e) => setMonthlyNeeds(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                Total Saldo Tabungan / Deposito / Kas (Rp)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={savingsAsset}
                                                onChange={(e) => setSavingsAsset(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                    Nilai Emas, Perak, atau Aset Niaga (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={goldAsset}
                                                    onChange={(e) => setGoldAsset(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                    Hutang Jatuh Tempo Tahun Ini (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={shortTermDebt}
                                                    onChange={(e) => setShortTermDebt(e.target.value)}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Result Summary Box */}
                                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <span className="text-xs font-semibold text-slate-600">
                                            Status Kewajiban Nisab:
                                        </span>
                                        {currentWajib ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                                <CheckCircleIcon className="w-4 h-4" />
                                                <span>Wajib Zakat (Telah Mencapai Nisab)</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                                <span>Belum Mencapai Nisab (Dianjurkan Infaq/Sedekah)</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                                        <span className="text-xs sm:text-sm font-bold text-slate-800">
                                            {currentWajib
                                                ? 'Estimasi Zakat Anda (2,5%):'
                                                : 'Rekomendasi Infaq Terbaik:'}
                                        </span>
                                        <span className="text-2xl sm:text-3xl font-heading font-extrabold text-primary tabular-nums">
                                            {currentWajib ? formatIDR(currentZakat) : formatIDR(100000)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={handlePayClick}
                                    className="w-full btn-primary py-3.5 text-sm sm:text-base justify-center"
                                >
                                    <HeartIcon className="w-5 h-5" />
                                    <span>
                                        {currentWajib
                                            ? `Tunaikan Zakat Sekarang (${formatIDR(currentZakat)})`
                                            : 'Salurkan Infaq & Sedekah Sekarang'}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

