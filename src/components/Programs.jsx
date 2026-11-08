import {
    AcademicCapIcon,
    HeartIcon,
    HomeModernIcon,
    SparklesIcon,
    UserGroupIcon,
    ArrowUpRightIcon
} from '@heroicons/react/24/outline';

const CAMPAIGNS = [
    {
        id: 'pendidikan',
        category: 'Pendidikan Formal & Tahfidz',
        title: 'Beasiswa SPP, Seragam & Kebutuhan Sekolah Santri Yatim',
        description: 'Memastikan seluruh anak asuh tingkat SD, SMP, dan SMA tetap bersekolah tepat waktu tanpa terkendala biaya daftar ulang maupun buku pelajaran.',
        collected: 18450000,
        target: 25000000,
        donors: 142,
        icon: AcademicCapIcon,
    },
    {
        id: 'pangan',
        category: 'Pemenuhan Gizi & Kesehatan',
        title: 'Penyediaan Beras, Lauk Bergizi & Vitamin Harian Asrama',
        description: 'Pemenuhan kebutuhan makan 3 kali sehari dengan takaran angka kecukupan gizi (AKG) seimbang, susu, serta pemeriksaan kesehatan berkala.',
        collected: 12800000,
        target: 15000000,
        donors: 98,
        icon: HeartIcon,
    },
    {
        id: 'wakaf',
        category: 'Sarana & Fasilitas Asrama',
        title: 'Pemeliharaan Kamar Asrama & Ruang Belajar Santri',
        description: 'Perbaikan fasilitas tempat tidur, lemari belajar, sanitasi air bersih, dan sarana ibadah agar anak-anak tumbuh di lingkungan yang layak dan nyaman.',
        collected: 34200000,
        target: 50000000,
        donors: 215,
        icon: HomeModernIcon,
    },
    {
        id: 'santunan',
        category: 'Sosial & Kemanusiaan',
        title: 'Santunan Rutin Yatim Non-Mukim & Dhuafa Sekitar Candimulyo',
        description: 'Penyaluran paket sembako dan uang saku pendidikan bagi anak yatim yang tinggal bersama wali dhuafa di lingkungan sekitar panti asuhan.',
        collected: 9250000,
        target: 12000000,
        donors: 76,
        icon: SparklesIcon,
    },
];

const FOSTER_CHILDREN = [
    {
        id: 1,
        code: 'AS-014',
        name: 'Adik Ahmad F.',
        age: '9 Tahun',
        grade: 'Kelas 3 SD / MI',
        aspiration: 'Hafidz Qur’an & Guru',
        monthlyNeed: 250000,
        status: 'Tersedia untuk Diasuh'
    },
    {
        id: 2,
        code: 'AS-021',
        name: 'Adik Siti N.',
        age: '11 Tahun',
        grade: 'Kelas 5 SD / MI',
        aspiration: 'Dokter Anak',
        monthlyNeed: 250000,
        status: 'Tersedia untuk Diasuh'
    },
    {
        id: 3,
        code: 'AS-029',
        name: 'Adik M. Rizky',
        age: '13 Tahun',
        grade: 'Kelas 1 SMP / MTs',
        aspiration: 'Arsitek & Pengusaha',
        monthlyNeed: 300000,
        status: 'Tersedia untuk Diasuh'
    },
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
        <>
            {/* Section 1: Program Donasi Utama */}
            <section id="programs" className="py-16 lg:py-24 bg-white border-b border-slate-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div className="max-w-2xl">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                Pilar Penyaluran Amanah
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                                Program Kebaikan Panti Asuhan As-Sholihin
                            </h2>
                            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                                Setiap dana donasi dialokasikan secara spesifik sesuai akad program yang Anda pilih dan dicatat langsung ke dalam pembukuan kas yayasan.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {CAMPAIGNS.map((item) => {
                            const Icon = item.icon;
                            const percent = Math.min(100, Math.round((item.collected / item.target) * 100));
                            return (
                                <div
                                    key={item.id}
                                    className="card-surface p-6 flex flex-col justify-between hover:border-primary/40 hover:shadow-card-hover"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                                                <Icon className="w-4 h-4 text-primary" />
                                                <span>{item.category}</span>
                                            </span>
                                            <span className="text-xs text-slate-500 font-medium tabular-nums">
                                                {item.donors} Donatur berpartisipasi
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100">
                                        {/* Progress Bar */}
                                        <div className="flex justify-between items-baseline text-xs mb-1.5">
                                            <span className="text-slate-500">
                                                Terkumpul:{' '}
                                                <strong className="text-slate-900 font-bold tabular-nums text-sm">
                                                    {formatIDR(item.collected)}
                                                </strong>
                                            </span>
                                            <span className="font-semibold text-primary tabular-nums">
                                                {percent}% dari {formatIDR(item.target)}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
                                            <div
                                                className="h-full bg-primary rounded-full transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                onSelectProgram &&
                                                onSelectProgram({
                                                    amount: 100000,
                                                    program: item.title
                                                })
                                            }
                                            className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-primary text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
                                        >
                                            <span>Salurkan Donasi Program Ini</span>
                                            <ArrowUpRightIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Section 2: Program Orang Tua Asuh (Child Sponsorship) */}
            <section id="foster" className="py-16 lg:py-20 bg-surface border-b border-slate-200/70">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Program Kafalah Bulanan
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                            Program Orang Tua Asuh (Sponsorship Pendidikan)
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                            Dukung keberlanjutan sekolah dan tumbuh kembang anak asuh secara rutin setiap bulan. Demi mematuhi Undang-Undang Perlindungan Anak, identitas sensitif anak disamarkan di ruang publik dan laporan perkembangan rapor dikirimkan langsung ke akun Orang Tua Asuh.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {FOSTER_CHILDREN.map((child) => (
                            <div
                                key={child.id}
                                className="card-surface p-6 flex flex-col justify-between bg-white"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-11 h-11 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm">
                                            <UserGroupIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                            {child.code} • {child.status}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900">{child.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {child.age} — {child.grade}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Cita-cita:</span>
                                            <span className="font-semibold text-slate-800">{child.aspiration}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Komitmen Kafalah:</span>
                                            <span className="font-bold text-primary tabular-nums">
                                                {formatIDR(child.monthlyNeed)} / bulan
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        onSelectProgram &&
                                        onSelectProgram({
                                            amount: child.monthlyNeed,
                                            program: `Kafalah Orang Tua Asuh - ${child.name} (${child.code})`
                                        })
                                    }
                                    className="mt-6 w-full btn-outline border-primary/30 text-primary hover:bg-primary hover:text-white hover:border-primary"
                                >
                                    Jadi Orang Tua Asuh
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

