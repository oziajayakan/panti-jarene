import {
    CheckBadgeIcon,
    HomeModernIcon,
    AcademicCapIcon,
    HeartIcon,
    ShieldCheckIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';

const PILLARS = [
    {
        title: 'Asrama Yatim & Dhuafa',
        desc: 'Menyediakan tempat tinggal yang aman, nyaman, dan kondusif bagi anak asuh putra maupun putri dengan pola pembinaan akhlakul karimah 24 jam.',
        icon: HomeModernIcon
    },
    {
        title: 'Pendidikan Formal & Tahfidz',
        desc: 'Menjamin biaya sekolah (SD/MI, SMP/MTs, SMA/SMK) hingga perguruan tinggi serta bimbingan rutin menghafal Al-Qur’an dan kajian kitab.',
        icon: AcademicCapIcon
    },
    {
        title: 'Pemenuhan Gizi & Kesehatan',
        desc: 'Menyediakan makanan bergizi seimbang tiga kali sehari, suplemen vitamin, serta layanan pemeriksaan kesehatan berkala bagi seluruh anak asuh.',
        icon: HeartIcon
    },
    {
        title: 'Pemberdayaan & Kemandirian',
        desc: 'Pelatihan keterampilan wirausaha, komputer, dan kemandirian karakter agar santri siap terjun ke masyarakat sebagai generasi yang berdaya.',
        icon: UserGroupIcon
    }
];

export default function AboutSection() {
    return (
        <section id="about" className="py-16 lg:py-24 bg-white border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    {/* Left: Sejarah, Visi & Legalitas (6 Cols) */}
                    <div className="lg:col-span-6 space-y-5">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                            <ShieldCheckIcon className="w-4 h-4" />
                            <span>Profil & Legalitas Lembaga</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 leading-tight">
                            Tentang Pondok Yatim & Dhuafa Panti Asuhan As-Sholihin
                        </h2>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            <strong>Panti Asuhan As-Sholihin</strong> yang bernaung di bawah <strong>Yayasan Assholihin Candimulyo Jombang</strong> merupakan Lembaga Kesejahteraan Sosial Anak (LKSA) yang didirikan sebagai wujud kepedulian umat dalam mengasuh, menyantuni, dan mendidik anak-anak yatim, piatu, serta dhuafa di Kabupaten Jombang dan sekitarnya.
                        </p>

                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                            Sebagaimana standar pelayanan <em>Pondok Yatim & Dhuafa</em> yang amanah dan profesional, kami memadukan kurikulum pendidikan sekolah formal dengan pembinaan karakter kepesantrenan, tahfidz Al-Qur&apos;an, serta keterbukaan laporan keuangan berbasis PSAK 109.
                        </p>

                        {/* Visi & Misi Box */}
                        <div className="p-5 rounded-xl bg-mint border border-emerald-900/10 space-y-3">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900">Visi Lembaga</h3>
                                <p className="text-xs sm:text-sm text-slate-600 mt-0.5 leading-relaxed">
                                    Menjadi lembaga pengasuhan anak yatim dan dhuafa yang amanah, profesional, dan unggul dalam melahirkan generasi berakhlak Qur&apos;ani serta mandiri.
                                </p>
                            </div>
                            <div className="pt-2 border-t border-emerald-900/10">
                                <h3 className="text-sm font-bold text-slate-900 mb-1.5">Legalitas Resmi Yayasan</h3>
                                <ul className="space-y-1 text-xs text-slate-700">
                                    <li className="flex items-center gap-2">
                                        <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />
                                        <span>Badan Hukum: <strong>Yayasan Assholihin Candimulyo Jombang (Kemenkumham RI)</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />
                                        <span>Izin Operasional LKSA: <strong>Terdaftar di Dinas Sosial Kabupaten Jombang</strong></span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckBadgeIcon className="w-4 h-4 text-primary shrink-0" />
                                        <span>Standar Pembayaran Nasional: <strong>QRIS Resmi NMID ID1026507480998</strong></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Right: 4 Pilar Pengasuhan Pondok Yatim (6 Cols) */}
                    <div className="lg:col-span-6">
                        <div className="mb-5">
                            <span className="text-xs font-bold uppercase tracking-wider text-primary">
                                4 Pilar Pengasuhan & Pemberdayaan
                            </span>
                            <h3 className="text-lg sm:text-xl font-heading font-bold text-slate-900 mt-1">
                                Bagaimana Amanah Donasi Anda Kami Kelola?
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {PILLARS.map((pillar, idx) => {
                                const Icon = pillar.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="card-surface p-5 flex flex-col justify-between bg-surface/60 hover:bg-white hover:border-primary/40 transition-all"
                                    >
                                        <div>
                                            <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center mb-3.5">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <h4 className="text-base font-bold text-slate-900 mb-1.5">
                                                {pillar.title}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                {pillar.desc}
                                            </p>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-primary">
                                            <span>Pilar Prioritas #{idx + 1}</span>
                                            <span>Terverifikasi</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

