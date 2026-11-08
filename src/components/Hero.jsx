import {
    ShieldCheckIcon,
    HeartIcon,
    AcademicCapIcon,
    HomeModernIcon,
    BanknotesIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/outline';

const QUICK_PILLS = [
    {
        id: 'infaq',
        title: 'Infaq Yatim',
        icon: HeartIcon,
        program: 'Santunan & Pendidikan Anak Yatim',
        amount: 100000
    },
    {
        id: 'zakat',
        title: 'Zakat 2,5%',
        icon: BanknotesIcon,
        program: 'Zakat Maal / Zakat Penghasilan',
        amount: 250000
    },
    {
        id: 'pendidikan',
        title: 'Beasiswa SPP',
        icon: AcademicCapIcon,
        program: 'Beasiswa SPP & Pendidikan Santri Yatim',
        amount: 250000
    },
    {
        id: 'wakaf',
        title: 'Wakaf Asrama',
        icon: HomeModernIcon,
        program: 'Wakaf Pemeliharaan Asrama',
        amount: 500000
    }
];

export default function Hero({ onDonateClick }) {
    return (
        <section id="hero" className="relative bg-mint border-b border-slate-200/80 py-12 lg:py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left: Concise Value Proposition */}
                    <div className="lg:col-span-6 space-y-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/5 border border-emerald-800/15 text-primary text-xs font-semibold">
                            <ShieldCheckIcon className="w-4 h-4 text-primary shrink-0" />
                            <span>LKSA Resmi Terdaftar • Candimulyo, Jombang</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                            Wujudkan Masa Depan Cerah{' '}
                            <span className="text-primary">Anak Yatim & Dhuafa.</span>
                        </h1>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl">
                            Salurkan Infaq, Zakat, dan Beasiswa Pendidikan secara amanah dengan laporan kas terbuka berstandar PSAK 109.
                        </p>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <button
                                type="button"
                                onClick={() => onDonateClick && onDonateClick()}
                                className="btn-primary px-6 py-3 text-sm shadow-xs"
                            >
                                <HeartIcon className="w-5 h-5 stroke-[2.2]" />
                                <span>Donasi Sekarang</span>
                            </button>

                            <a
                                href="#transparency"
                                className="btn-outline px-5 py-3 text-sm bg-white"
                            >
                                <span>Cek Laporan Kas</span>
                            </a>
                        </div>

                        {/* Quick Program Pills */}
                        <div className="pt-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                Pilih Cepat Akad Donasi:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_PILLS.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() =>
                                                onDonateClick &&
                                                onDonateClick({ program: item.program, amount: item.amount })
                                            }
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-primary hover:text-primary text-xs font-semibold text-slate-700 transition-all shadow-2xs"
                                        >
                                            <Icon className="w-4 h-4 text-primary" />
                                            <span>{item.title}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Clean Visual Card */}
                    <div className="lg:col-span-6">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-elevated">
                            <img
                                src={`${import.meta.env.BASE_URL}img/hero-bg.jpg`}
                                alt="Santri Panti Asuhan As-Sholihin"
                                className="w-full h-[280px] sm:h-[340px] object-cover"
                            />
                            <div className="p-4 sm:p-5 bg-white flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                                        <CheckBadgeIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-900">
                                            Yayasan Assholihin Candimulyo
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            100% Terverifikasi QRIS Nasional & Audit Kas Real-Time
                                        </p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                                    PSAK 109
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
