import {
    ShieldCheckIcon,
    HeartIcon,
    AcademicCapIcon,
    HomeModernIcon,
    SparklesIcon,
    BanknotesIcon,
    CalculatorIcon,
    CheckBadgeIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const QUICK_SERVICES = [
    {
        id: 'zakat',
        title: 'Zakat Maal & Profesi',
        subtitle: 'Tunaikan kewajiban zakat 2,5% tepat sasaran',
        icon: BanknotesIcon,
        actionType: 'donate',
        program: 'Zakat Maal / Zakat Penghasilan',
        amount: 250000
    },
    {
        id: 'infaq',
        title: 'Infaq & Sedekah Yatim',
        subtitle: 'Santunan harian & gizi santri mukim asrama',
        icon: HeartIcon,
        actionType: 'donate',
        program: 'Santunan & Pendidikan Anak Yatim',
        amount: 100000
    },
    {
        id: 'pendidikan',
        title: 'Beasiswa & Orang Tua Asuh',
        subtitle: 'Dukung SPP, seragam & tahfidz Al-Qur’an',
        icon: AcademicCapIcon,
        actionType: 'anchor',
        href: '#foster'
    },
    {
        id: 'wakaf',
        title: 'Wakaf Asrama & Sarana',
        subtitle: 'Amal jariyah fasilitas tempat tinggal santri',
        icon: HomeModernIcon,
        actionType: 'donate',
        program: 'Wakaf Pemeliharaan Asrama',
        amount: 500000
    },
    {
        id: 'kalkulator',
        title: 'Kalkulator Zakat',
        subtitle: 'Hitung nisab zakat profesi & tabungan Anda',
        icon: CalculatorIcon,
        actionType: 'anchor',
        href: '#zakat'
    }
];

export default function Hero({ onDonateClick }) {
    return (
        <section id="hero" className="relative bg-mint border-b border-slate-200/80 pt-10 pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Main Hero Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                    {/* Left Column: Headline & Institutional Message (7 Cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/5 border border-emerald-800/15 text-primary text-xs font-semibold">
                            <ShieldCheckIcon className="w-4 h-4 text-primary shrink-0" />
                            <span>Pondok Yatim & Dhuafa — LKSA Terakreditasi Jombang</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                            Bersama Memuliakan{' '}
                            <span className="text-primary">Anak Yatim & Dhuafa</span> Menuju Kemandirian.
                        </h1>

                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                            <strong>Panti Asuhan As-Sholihin (Yayasan Assholihin Candimulyo Jombang)</strong> merupakan lembaga sosial kemanusiaan dan keagamaan yang berkomitmen mengasuh, mendidik, serta memberdayakan anak-anak yatim piatu dan dhuafa dengan pengelolaan dana ZISWAF yang amanah dan transparan.
                        </p>

                        {/* Hadith Quote Box */}
                        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/90 shadow-card max-w-xl">
                            <p className="text-sm text-slate-700 italic leading-relaxed">
                                &ldquo;Aku dan orang yang menanggung (mengasuh) anak yatim berada di surga seperti dua jari ini (jari telunjuk dan jari tengah).&rdquo;
                            </p>
                            <p className="text-xs font-semibold text-primary mt-1.5">
                                — HR. Bukhari No. 5304
                            </p>
                        </div>

                        {/* CTA Action Buttons */}
                        <div className="pt-2 flex flex-wrap items-center gap-3.5">
                            <button
                                type="button"
                                onClick={() => onDonateClick && onDonateClick()}
                                className="btn-primary px-6 py-3.5 text-sm sm:text-base shadow-sm"
                            >
                                <HeartIcon className="w-5 h-5 stroke-[2.2]" />
                                <span>Tunaikan Donasi Sekarang</span>
                            </button>
                            <a
                                href="#programs"
                                className="btn-outline px-5 py-3.5 text-sm sm:text-base bg-white"
                            >
                                <span>Lihat Program Kebaikan</span>
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Institutional Photo & Profile Showcase (5 Cols) */}
                    <div className="lg:col-span-5">
                        <div className="relative rounded-2xl bg-white p-3 border border-slate-200/90 shadow-elevated">
                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-slate-100">
                                <img
                                    src={`${import.meta.env.BASE_URL}img/hero-bg.jpg`}
                                    alt="Santri Asuh Panti Asuhan As-Sholihin Jombang"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent flex flex-col justify-end p-5">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-white text-[11px] font-semibold w-fit mb-2">
                                        <SparklesIcon className="w-3.5 h-3.5" />
                                        <span>Asrama Putra & Putri Candimulyo</span>
                                    </span>
                                    <h2 className="text-white font-heading font-bold text-base sm:text-lg leading-snug">
                                        Pengasuhan Berbasis Pesantren, Pendidikan Formal & Tahfidz Al-Qur&apos;an
                                    </h2>
                                </div>
                            </div>

                            {/* Bottom Info Strip inside Photo Frame */}
                            <div className="mt-3 px-2 py-2 flex items-center justify-between gap-3 text-xs">
                                <div className="flex items-center gap-2.5">
                                    <img
                                        src={`${import.meta.env.BASE_URL}img/logo.png`}
                                        alt="Logo Yayasan Assholihin"
                                        className="w-9 h-9 rounded-lg object-contain border border-slate-200 p-0.5 bg-white"
                                    />
                                    <div>
                                        <div className="font-bold text-slate-900 flex items-center gap-1">
                                            <span>LKSA As-Sholihin Jombang</span>
                                            <CheckBadgeIcon className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="text-[11px] text-slate-500 flex items-center gap-1">
                                            <MapPinIcon className="w-3 h-3" />
                                            <span>Desa Candimulyo, Kec. Jombang</span>
                                        </div>
                                    </div>
                                </div>
                                <a
                                    href="#rekening"
                                    className="text-xs font-semibold text-primary hover:underline shrink-0"
                                >
                                    Cek QRIS & Rekening →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Access Bar ala PondokYatim.or.id (5 Pillars) */}
                <div className="mt-12 lg:mt-14 pt-8 border-t border-emerald-900/10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Layanan Utama ZISWAF & Kemanusiaan
                        </span>
                        <span className="text-xs text-slate-500 hidden sm:inline">
                            Pilih layanan untuk menyalurkan kebaikan atau menghitung zakat
                        </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
                        {QUICK_SERVICES.map((item) => {
                            const Icon = item.icon;
                            if (item.actionType === 'anchor') {
                                return (
                                    <a
                                        key={item.id}
                                        href={item.href}
                                        className="group bg-white p-4 rounded-xl border border-slate-200/90 hover:border-primary hover:shadow-card-hover transition-all flex items-start gap-3.5"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                                {item.subtitle}
                                            </p>
                                        </div>
                                    </a>
                                );
                            }
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() =>
                                        onDonateClick &&
                                        onDonateClick({
                                            amount: item.amount,
                                            program: item.program
                                        })
                                    }
                                    className="group bg-white p-4 rounded-xl border border-slate-200/90 hover:border-primary hover:shadow-card-hover transition-all flex items-start gap-3.5 text-left"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
