import {
    AcademicCapIcon,
    HeartIcon,
    HomeModernIcon,
    SparklesIcon
} from '@heroicons/react/24/outline';

const CAMPAIGNS = [
    {
        id: 'pendidikan',
        category: 'Pendidikan',
        title: 'Beasiswa SPP & Seragam Sekolah Santri',
        description: 'Menjamin biaya SPP, buku & perlengkapan sekolah SD hingga SMA.',
        collected: 18450000,
        target: 25000000,
        donors: 142,
        icon: AcademicCapIcon
    },
    {
        id: 'pangan',
        category: 'Pangan & Gizi',
        title: 'Beras, Lauk Bergizi & Vitamin Harian',
        description: 'Kebutuhan makan sehat 3x sehari bagi seluruh anak asuh mukim.',
        collected: 12800000,
        target: 15000000,
        donors: 98,
        icon: HeartIcon
    },
    {
        id: 'wakaf',
        category: 'Sarana Asrama',
        title: 'Pemeliharaan Kamar & Ruang Belajar',
        description: 'Perbaikan fasilitas tidur, lemari belajar, dan sanitasi asrama.',
        collected: 34200000,
        target: 50000000,
        donors: 215,
        icon: HomeModernIcon
    },
    {
        id: 'santunan',
        category: 'Sosial Yatim',
        title: 'Santunan Yatim Non-Mukim & Dhuafa',
        description: 'Paket sembako & uang saku pendidikan yatim sekitar Candimulyo.',
        collected: 9250000,
        target: 12000000,
        donors: 76,
        icon: SparklesIcon
    }
];

export default function Programs({ onSelectProgram }) {
    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val);
    };

    return (
        <section id="programs" className="py-12 lg:py-16 bg-surface bg-subtle-animated border-b border-slate-200/70 relative overflow-hidden">
            <div className="pointer-events-none absolute top-10 -right-24 w-72 h-72 rounded-full bg-emerald-200/20 blur-3xl animate-pulse-soft" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Program Penyaluran
                        </span>
                        <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mt-0.5">
                            Pilih Program Kebaikan Anda
                        </h2>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500">
                        Klik program untuk langsung menyalurkan donasi terbaik.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {CAMPAIGNS.map((item) => {
                        const Icon = item.icon;
                        const percentage = Math.min(100, Math.round((item.collected / item.target) * 100));

                        return (
                            <div
                                key={item.id}
                                className="card-surface p-5 sm:p-6 flex flex-col justify-between hover:border-primary/40 transition-all"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-md">
                                            <Icon className="w-4 h-4" />
                                            <span>{item.category}</span>
                                        </span>
                                        <span className="text-xs font-medium text-slate-400">
                                            {item.donors} Donatur
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1.5">
                                            <span className="font-bold text-primary tabular-nums">
                                                {formatIDR(item.collected)}
                                            </span>
                                            <span className="text-slate-500 tabular-nums">
                                                Target {formatIDR(item.target)} ({percentage}%)
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onSelectProgram &&
                                            onSelectProgram({
                                                program: item.title,
                                                amount: 100000
                                            })
                                        }
                                        className="w-full py-2.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
                                    >
                                        Donasi Program Ini
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
