import {
    CheckBadgeIcon,
    HomeModernIcon,
    AcademicCapIcon,
    HeartIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const PILLARS = [
    {
        title: 'Asrama 24 Jam',
        desc: 'Hunian aman & pembinaan karakter kepesantrenan.',
        icon: HomeModernIcon
    },
    {
        title: 'Sekolah & Tahfidz',
        desc: 'Beasiswa SD–SMA penuh & setoran hafalan Al-Qur’an.',
        icon: AcademicCapIcon
    },
    {
        title: 'Gizi & Kesehatan',
        desc: 'Makan bergizi 3x sehari, vitamin & layanan medis.',
        icon: HeartIcon
    },
    {
        title: 'Kemandirian Santri',
        desc: 'Pelatihan komputer & keterampilan hidup mandiri.',
        icon: UserGroupIcon
    }
];

export default function AboutSection() {
    return (
        <section id="about" className="py-12 lg:py-16 bg-white border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Compact Header + Legal Badges */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Empat Pilar Pengasuhan
                        </span>
                        <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mt-0.5">
                            Amanah Mengasuh & Mendidik Generasi Mandiri
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint text-primary border border-emerald-200">
                            <CheckBadgeIcon className="w-4 h-4" />
                            <span>SK Kemenkumham RI</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint text-primary border border-emerald-200">
                            <CheckBadgeIcon className="w-4 h-4" />
                            <span>Terdaftar Dinsos Jombang</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint text-primary border border-emerald-200">
                            <CheckBadgeIcon className="w-4 h-4" />
                            <span>Audit Kas PSAK 109</span>
                        </span>
                    </div>
                </div>

                {/* 4 Compact Visual Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {PILLARS.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div
                                key={idx}
                                className="group p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-primary/40 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">{pillar.title}</h3>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{pillar.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
