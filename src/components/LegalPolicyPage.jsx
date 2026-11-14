import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    MagnifyingGlassIcon,
    ChevronRightIcon,
    ArrowLeftIcon,
    ShieldCheckIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

const LEGAL_ARTICLES = [
    {
        id: 'ketentuan-layanan',
        title: 'Ketentuan Penggunaan & Layanan Donasi',
        effectiveDate: '1 November 2026',
        summary:
            'Ketentuan ini mengatur tata cara penggunaan platform donasi digital resmi Panti Asuhan As-Sholihin Candimulyo oleh donatur, calon orang tua asuh, dan pengunjung.',
        sections: [
            {
                id: 'pendahuluan',
                title: '1. Pendahuluan & Ruang Lingkup',
                content:
                    'Platform web donasi ini dikelola secara resmi oleh Yayasan LKSA Panti Asuhan As-Sholihin Candimulyo, Kabupaten Jombang. Dengan mengakses atau menyalurkan donasi melalui situs ini, Anda menyetujui ketentuan layanan yang berlaku demi menjaga amanah dan ketertiban administrasi.'
            },
            {
                id: 'penyaluran-dana',
                title: '2. Penyaluran Infaq, Zakat & Wakaf',
                content:
                    'Seluruh dana yang masuk melalui QRIS Nasional maupun Virtual Account (Midtrans) dicatat secara otomatis ke dalam buku kas yayasan dan disalurkan sesuai akad yang dipilih donatur: operasional asrama, pangan bergizi, beasiswa pendidikan, atau santunan yatim non-mukim.'
            },
            {
                id: 'biaya-transaksi',
                title: '3. Biaya Layanan Payment Gateway',
                content:
                    'Transaksi digital melalui QRIS atau Virtual Account dapat dikenakan biaya administrasi standar penyedia jasa pembayaran (Midtrans/Bank) sesuai regulasi Bank Indonesia. Nilai donasi bersih yang diterima yayasan akan tercatat secara transparan.'
            }
        ]
    },
    {
        id: 'kebijakan-privasi',
        title: 'Kebijakan Privasi & Perlindungan Data',
        effectiveDate: '1 November 2026',
        summary:
            'Kami berkomitmen melindungi data pribadi donatur serta menjaga privasi identitas anak asuh sesuai ketentuan perlindungan data dan hak anak.',
        sections: [
            {
                id: 'data-donatur',
                title: '1. Kerahasiaan Data Donatur',
                content:
                    'Data nama, nomor WhatsApp, dan email donatur hanya digunakan untuk pengiriman bukti transaksi, laporan penyaluran berkala, dan verifikasi pembayaran. Donatur berhak memilih opsi "Hamba Allah" agar namanya tidak ditampilkan pada daftar donasi publik.'
            },
            {
                id: 'privasi-anak',
                title: '2. Perlindungan Identitas Anak Asuh',
                content:
                    'Untuk menjaga martabat dan keamanan psikososial anak asuh, data sensitif seperti NIK, dokumen keluarga, serta riwayat asesmen kelayakan adopsi hanya dapat diakses oleh pengurus berwenang di Dashboard Admin dan tidak pernah dipublikasikan secara terbuka.'
            }
        ]
    },
    {
        id: 'kebijakan-refund',
        title: 'Kebijakan Pembatalan & Pengembalian Dana',
        effectiveDate: '1 November 2026',
        summary:
            'Prosedur penanganan apabila terjadi kesalahan nominal transfer atau kendala teknis saat proses pembayaran berlangsung.',
        sections: [
            {
                id: 'batas-waktu-bayar',
                title: '1. Batas Waktu Pembayaran Otomatis',
                content:
                    'Setiap transaksi yang dibuat melalui Payment Gateway memiliki batas waktu tunggu pembayaran. Apabila melewati batas waktu tersebut tanpa ada pelunasan, status transaksi akan otomatis dibatalkan (Expired/Gagal) oleh sistem.'
            },
            {
                id: 'klaim-kesalahan',
                title: '2. Pengajuan Koreksi / Refund',
                content:
                    'Donasi yang telah berhasil diverifikasi pada prinsipnya bersifat final sebagai amal jariyah. Namun, apabila terjadi kesalahan teknis pendebetan ganda atau salah nominal yang signifikan, donatur dapat menghubungi sekretariat resmi yayasan maksimal 3x24 jam dengan melampirkan bukti mutasi.'
            }
        ]
    },
    {
        id: 'adopsi-dan-asuh',
        title: 'Kepatuhan Adopsi & Program Orang Tua Asuh',
        effectiveDate: '1 November 2026',
        summary:
            'Penyelenggaraan pengasuhan, pengangkatan anak (adopsi), dan program Orang Tua Asuh mengikuti peraturan perundang-undangan yang berlaku di Indonesia.',
        sections: [
            {
                id: 'regulasi-adopsi',
                title: '1. Kepatuhan PP No. 54/2007 & Permensos 110/2014',
                content:
                    'Yayasan tidak pernah memperjualbelikan atau memindahtangankan anak secara ilegal. Setiap pengajuan adopsi wajib melalui asesmen kelayakan latar belakang anak, verifikasi Calon Orang Tua Angkat (COTA), Home Visit Pekerja Sosial, dan penetapan resmi Dinas Sosial / Pengadilan.'
            },
            {
                id: 'program-ota',
                title: '2. Skema Orang Tua Asuh (Kafalah Pendidikan)',
                content:
                    'Bagi anak yang masih memiliki keluarga kandung dhuafa atau berusia remaja mandiri, yayasan mengarahkan dukungan melalui Program Orang Tua Asuh berupa beasiswa SPP, seragam, dan biaya hidup bulanan tanpa memutus hubungan nasab.'
            }
        ]
    },
    {
        id: 'legalitas-yayasan',
        title: 'Legalitas & Akuntabilitas Lembaga',
        effectiveDate: '1 November 2026',
        summary:
            'Informasi resmi mengenai badan hukum, izin operasional LKSA, serta komitmen pelaporan keuangan terbuka Yayasan Assholihin Candimulyo.',
        sections: [
            {
                id: 'badan-hukum',
                title: '1. Identitas & Izin Operasional',
                content:
                    'LKSA Panti Asuhan As-Sholihin bernaung di bawah Yayasan Assholihin Candimulyo, Jombang, Jawa Timur, dan terdaftar sebagai Lembaga Kesejahteraan Sosial Anak (LKSA) resmi di bawah pembinaan Dinas Sosial.'
            },
            {
                id: 'audit-terbuka',
                title: '2. Pelaporan Kas Terbuka',
                content:
                    'Rekapitulasi pemasukan donasi dan realisasi pengeluaran operasional asrama disajikan pada Portal Transparansi Dana di halaman utama agar dapat dipantau oleh seluruh masyarakat dan donatur.'
            }
        ]
    }
];

export default function LegalPolicyPage() {
    const [activeArticleId, setActiveArticleId] = useState(LEGAL_ARTICLES[0].id);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredArticles = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return LEGAL_ARTICLES;
        return LEGAL_ARTICLES.filter(
            (art) =>
                art.title.toLowerCase().includes(q) ||
                art.summary.toLowerCase().includes(q) ||
                art.sections.some(
                    (s) =>
                        s.title.toLowerCase().includes(q) ||
                        s.content.toLowerCase().includes(q)
                )
        );
    }, [searchQuery]);

    const activeArticle =
        filteredArticles.find((a) => a.id === activeArticleId) ||
        filteredArticles[0] ||
        LEGAL_ARTICLES[0];

    const scrollToSection = (sectionId) => {
        const el = document.getElementById(sectionId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-slate-100"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            <span>Kembali ke Beranda</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                            <span>Dokumen Legal</span>
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                            <span className="text-slate-700 font-semibold">Kepatuhan &amp; Kebijakan Layanan</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full max-w-xs sm:max-w-sm">
                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari di kebijakan & kepatuhan..."
                            className="w-full pl-9 pr-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        />
                    </div>
                </div>
            </header>

            {/* Main Structured Layout (Sidebar + Content) */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Sidebar: Daftar Pasal & Sub-bab */}
                    <aside className="lg:col-span-3 space-y-6 lg:sticky lg:top-24">
                        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                                Artikel Dalam Bagian Ini
                            </h2>
                            <nav className="space-y-1">
                                {filteredArticles.map((art) => {
                                    const isActive = activeArticle.id === art.id;
                                    return (
                                        <button
                                            key={art.id}
                                            type="button"
                                            onClick={() => setActiveArticleId(art.id)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                                                isActive
                                                    ? 'bg-emerald-50 text-primary font-bold border border-emerald-200/70'
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            {art.title}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Sub-bab / Quick Jump */}
                        <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
                            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">
                                Daftar Isi Pasal
                            </h2>
                            <ul className="space-y-1.5">
                                {activeArticle.sections.map((sec) => (
                                    <li key={sec.id}>
                                        <button
                                            type="button"
                                            onClick={() => scrollToSection(sec.id)}
                                            className="w-full text-left px-2 py-1 text-xs text-slate-600 hover:text-primary transition-colors"
                                        >
                                            {sec.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <article className="lg:col-span-9 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 shadow-card space-y-8">
                        <div className="border-b border-slate-100 pb-6 space-y-3">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-primary">
                                <ShieldCheckIcon className="w-4 h-4" />
                                <span>Dokumen Kepatuhan Resmi</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                                {activeArticle.title}
                            </h1>
                            <p className="text-xs text-slate-400 italic">
                                Tanggal Berlaku: {activeArticle.effectiveDate} • Panti Asuhan As-Sholihin Candimulyo
                            </p>
                            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
                                {activeArticle.summary}
                            </p>
                        </div>

                        {/* Daftar Isi Ringkas */}
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                                <DocumentTextIcon className="w-4 h-4 text-primary" />
                                <span>Ringkasan Pasal</span>
                            </span>
                            <ul className="space-y-1">
                                {activeArticle.sections.map((sec) => (
                                    <li key={sec.id}>
                                        <button
                                            type="button"
                                            onClick={() => scrollToSection(sec.id)}
                                            className="text-xs sm:text-sm text-primary hover:underline font-medium text-left"
                                        >
                                            {sec.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Isi Pasal */}
                        <div className="space-y-6">
                            {activeArticle.sections.map((sec) => (
                                <section
                                    key={sec.id}
                                    id={sec.id}
                                    className="scroll-mt-24 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0"
                                >
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
                                        {sec.title}
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                                        {sec.content}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
}
