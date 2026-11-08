import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon, LockClosedIcon } from '@heroicons/react/24/outline';

const POLICY_CONTENT = {
    terms: {
        title: 'Syarat & Ketentuan Layanan Donasi Online',
        content: `1. Yayasan Assholihin Candimulyo Jombang (LKSA Panti Asuhan As-Sholihin) adalah lembaga kesejahteraan sosial anak resmi yang menghimpun dan menyalurkan dana donasi, infaq, sedekah, serta zakat.
2. Setiap dana yang didonasikan oleh Donatur melalui portal website ini akan dialokasikan secara amanah untuk pemenuhan kebutuhan pendidikan, pangan, kesehatan, serta operasional pengasuhan anak yatim piatu dan dhuafa.
3. Donatur menyatakan bahwa dana yang disalurkan berasal dari sumber yang halal dan tidak melanggar peraturan hukum Republik Indonesia terkait Tindak Pidana Pencucian Uang (TPPU).
4. Bukti donasi resmi (E-Kwitansi) diterbitkan secara otomatis setelah pembayaran terverifikasi oleh sistem Payment Gateway atau rekening resmi yayasan.`
    },
    privacy: {
        title: 'Kebijakan Privasi & Perlindungan Data Donatur',
        content: `1. Panti Asuhan As-Sholihin berkomitmen melindungi privasi dan data pribadi setiap Donatur sesuai Undang-Undang Perlindungan Data Pribadi (UU PDP).
2. Data nama, nomor WhatsApp, dan alamat email hanya digunakan untuk pengiriman bukti E-Kwitansi donasi serta laporan pertanggungjawaban penggunaan dana (E-LPJ).
3. Donatur berhak mengaktifkan fitur 'Hamba Allah' (Mode Anonim) sehingga nama asli tidak ditampilkan pada daftar donatur publik di halaman website.
4. Kami tidak pernah memperjualbelikan atau membagikan data kontak donatur kepada pihak ketiga mana pun.`
    },
    refund: {
        title: 'Kebijakan Pembatalan & Pengembalian Dana (Refund Policy)',
        content: `1. Pada prinsipnya, dana akad donasi/infaq/sedekah/zakat yang telah disalurkan tidak dapat ditarik kembali kecuali terjadi kekeliruan teknis nominal transfer (seperti kesalahan pengetikan digit atau transaksi terdebet ganda).
2. Pengajuan koreksi atau pengembalian kelebihan transfer dapat diajukan maksimal 3x24 jam sejak waktu transaksi dengan menghubungi Layanan Sekretariat WhatsApp resmi (+62 812-3456-7890) disertai bukti mutasi pembayaran.
3. Dana pengembalian hanya akan ditransfer kembali ke nomor rekening asal milik donatur yang terverifikasi setelah proses rekonsiliasi buku kas selesai dilakukan oleh Bendahara Yayasan.`
    }
};

export default function Footer() {
    const [activePolicy, setActivePolicy] = useState(null);

    return (
        <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
            {/* Supported Payment Channels Bar */}
            <div className="border-b border-slate-800/80 bg-slate-950/40 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-xs text-slate-400">
                        <LockClosedIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                            Saluran Pembayaran Terintegrasi & Terverifikasi (QRIS NMID: <strong className="text-slate-200 font-mono">ID1026507480998</strong>)
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-300">
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">QRIS Nasional</span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">BSI Syariah</span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">BCA VA</span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">Mandiri VA</span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">BRI VA</span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">BNI VA</span>
                        <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700">GoPay / ShopeePay / OVO / DANA</span>
                    </div>
                </div>
            </div>

            {/* Main Footer Columns */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
                    {/* Column 1: Institution Identity (5 Cols) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={`${import.meta.env.BASE_URL}img/logo.png`}
                                alt="Logo Yayasan Assholihin"
                                className="h-11 w-11 rounded-lg bg-white p-0.5 object-contain"
                            />
                            <div>
                                <h3 className="font-heading font-bold text-base text-white">
                                    Panti Asuhan As-Sholihin
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Yayasan Assholihin Candimulyo Jombang
                                </p>
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
                            Lembaga Kesejahteraan Sosial Anak (LKSA) yang berfokus pada pengasuhan, pendidikan formal, pembinaan akhlak mulia, dan kemandirian anak yatim piatu serta dhuafa di Kabupaten Jombang.
                        </p>

                        <div className="pt-2 space-y-1 text-xs text-slate-400">
                            <p className="flex items-center gap-1.5 text-emerald-400 font-medium">
                                <ShieldCheckIcon className="w-4 h-4" />
                                <span>Akreditasi & Legalitas Resmi Lembaga:</span>
                            </p>
                            <p>SK Kemenkumham RI: Yayasan Assholihin Candimulyo Jombang</p>
                            <p>Terdaftar di Dinas Sosial Kabupaten Jombang — Jawa Timur</p>
                        </div>
                    </div>

                    {/* Column 2: Navigation & Programs (2 Cols) */}
                    <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Menu Utama
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                            <li><a href="#hero" className="hover:text-white transition-colors">Beranda</a></li>
                            <li><a href="#programs" className="hover:text-white transition-colors">Program Donasi</a></li>
                            <li><a href="#foster" className="hover:text-white transition-colors">Orang Tua Asuh</a></li>
                            <li><a href="#transparency" className="hover:text-white transition-colors">Transparansi Kas</a></li>
                            <li><Link to="/portal-donatur" className="hover:text-white transition-colors">Portal Akun Donatur</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Mandatory Payment Gateway Legal Policies (3 Cols) */}
                    <div className="lg:col-span-3 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Kepatuhan & Kebijakan Layanan
                        </h4>
                        <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setActivePolicy('terms')}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Syarat & Ketentuan Donasi
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setActivePolicy('privacy')}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Kebijakan Privasi Donatur
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setActivePolicy('refund')}
                                    className="hover:text-white transition-colors text-left"
                                >
                                    Kebijakan Pengembalian Dana (Refund)
                                </button>
                            </li>
                            <li>
                                <a href="#transparency" className="hover:text-white transition-colors">
                                    Laporan Keuangan PSAK 109
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Official Address (2 Cols) */}
                    <div className="lg:col-span-2 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                            Sekretariat
                        </h4>
                        <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
                            <p>Desa Candimulyo, Kec. Jombang, Kab. Jombang, Jawa Timur 61413</p>
                            <p className="text-slate-300 font-medium">+62 812-3456-7890</p>
                            <p>sekretariat@assholihin-jombang.or.id</p>
                        </div>
                    </div>
                </div>

                {/* Policy Viewer Drawer / Box if clicked */}
                {activePolicy && (
                    <div className="mt-8 p-6 rounded-xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm text-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                            <h5 className="font-bold text-white text-base">
                                {POLICY_CONTENT[activePolicy].title}
                            </h5>
                            <button
                                type="button"
                                onClick={() => setActivePolicy(null)}
                                className="text-xs text-slate-400 hover:text-white font-semibold"
                            >
                                Tutup [X]
                            </button>
                        </div>
                        <p className="whitespace-pre-line text-slate-300 leading-relaxed">
                            {POLICY_CONTENT[activePolicy].content}
                        </p>
                    </div>
                )}

                {/* Bottom Copyright */}
                <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <p>
                        &copy; {new Date().getFullYear()} Yayasan Assholihin Candimulyo Jombang — Panti Asuhan As-Sholihin. Hak Cipta Dilindungi.
                    </p>
                    <p>
                        Standar Transparansi Keuangan Nirlaba PSAK 109
                    </p>
                </div>
            </div>
        </footer>
    );
}
