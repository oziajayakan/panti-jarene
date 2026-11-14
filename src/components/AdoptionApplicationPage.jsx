import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowLeftIcon,
    CheckCircleIcon,
    ShieldCheckIcon,
    DocumentTextIcon
} from '@heroicons/react/24/outline';

export default function AdoptionApplicationPage() {
    const [submitted, setSubmitted] = useState(false);
    const [existingApp, setExistingApp] = useState(() => {
        try {
            const list = JSON.parse(localStorage.getItem('assholihin_adoption_applications') || '[]');
            return list[0] || null;
        } catch {
            return null;
        }
    });
    const [form, setForm] = useState({
        namaLengkap: '',
        nik: '',
        usia: 34,
        whatsapp: '',
        statusNikah: 'Menikah (>= 5 Tahun)',
        pekerjaan: 'Pegawai Swasta / BUMN',
        pekerjaanCustom: '',
        penghasilan: 'Rp 7.500.000 - Rp 15.000.000 / bulan',
        tempatTinggal: 'Rumah Milik Sendiri',
        tempatTinggalCustom: '',
        alasanAdopsi: 'Ingin memberikan kasih sayang & pendidikan layak',
        alasanAdopsiCustom: '',
        preferensiUsia: 'Balita (1 - 5 Tahun)',
        kesiapanDokumen: 'Lengkap (KTP, KK, Akta Nikah, SKCK, Ket. Sehat)',
        alamat: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            id: `COTA-${Date.now()}`,
            ...form,
            pekerjaanFinal:
                form.pekerjaan === 'Lainnya' ? form.pekerjaanCustom || 'Lainnya' : form.pekerjaan,
            tempatTinggalFinal:
                form.tempatTinggal === 'Lainnya'
                    ? form.tempatTinggalCustom || 'Lainnya'
                    : form.tempatTinggal,
            alasanAdopsiFinal:
                form.alasanAdopsi === 'Lainnya'
                    ? form.alasanAdopsiCustom || 'Lainnya'
                    : form.alasanAdopsi,
            status: 'MENUNGGU_VERIFIKASI',
            createdAt: new Date().toISOString()
        };

        try {
            const existing = JSON.parse(
                localStorage.getItem('assholihin_adoption_applications') || '[]'
            );
            localStorage.setItem(
                'assholihin_adoption_applications',
                JSON.stringify([payload, ...existing])
            );
            window.dispatchEvent(new Event('assholihin-data-updated'));
            setExistingApp(payload);
        } catch {
            // ignore storage errors
        }
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top Bar */}
            <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Pengajuan COTA Resmi
                    </span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
                {submitted || existingApp?.status === 'MENUNGGU_VERIFIKASI' ? (
                    <div className="bg-white rounded-2xl border border-amber-200 p-8 sm:p-10 text-center shadow-card space-y-4">
                        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                            <CheckCircleIcon className="w-8 h-8" />
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700">
                            Status: Menunggu Persetujuan Pihak Panti
                        </span>
                        <h1 className="text-2xl font-heading font-bold text-slate-900">
                            Pengajuan Anda Masih Dalam Proses Peninjauan
                        </h1>
                        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                            Pengajuan atas nama <strong>{existingApp?.namaLengkap || 'Anda'}</strong> ({existingApp?.id}) sedang dalam proses verifikasi oleh pihak Panti Asuhan As-Sholihin. Anda akan menerima notifikasi melalui WhatsApp ({existingApp?.whatsapp}) setelah keputusan ditetapkan.
                        </p>
                        <div className="pt-2">
                            <Link to="/" className="btn-primary text-xs py-2.5 px-5 inline-flex">
                                Kembali ke Halaman Utama
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-card overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-white to-mint/40">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-primary mb-3">
                                <ShieldCheckIcon className="w-4 h-4" />
                                <span>Formulir Calon Orang Tua Angkat</span>
                            </div>
                            <h1 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                                Pengajuan Kelayakan Adopsi Anak Online
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                                Lengkapi data di bawah ini dengan jujur sesuai PP No. 54 Tahun 2007. Sistem akan menghitung tingkat kecocokan dan meneruskannya ke Admin untuk keputusan persetujuan.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                            {/* Data Identitas */}
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-3">
                                    <DocumentTextIcon className="w-4 h-4 text-primary" />
                                    <span>1. Identitas Calon Orang Tua Angkat</span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Nama Lengkap Pemohon *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.namaLengkap}
                                            onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
                                            placeholder="Sesuai KTP"
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            NIK (Nomor Induk Kependudukan) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={form.nik}
                                            onChange={(e) => setForm({ ...form, nik: e.target.value })}
                                            placeholder="16 digit NIK"
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Usia Pemohon (Tahun) *
                                        </label>
                                        <input
                                            type="number"
                                            min="21"
                                            max="65"
                                            required
                                            value={form.usia}
                                            onChange={(e) => setForm({ ...form, usia: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            No. WhatsApp Aktif *
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={form.whatsapp}
                                            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                                            placeholder="0812xxxxxxxx"
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Kondisi Keluarga & Ekonomi */}
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                    2. Kondisi Keluarga, Pekerjaan &amp; Tempat Tinggal
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Status Pernikahan
                                        </label>
                                        <select
                                            value={form.statusNikah}
                                            onChange={(e) => setForm({ ...form, statusNikah: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                        >
                                            <option value="Menikah (>= 5 Tahun)">Menikah (&ge; 5 Tahun)</option>
                                            <option value="Menikah (< 5 Tahun)">Menikah (&lt; 5 Tahun)</option>
                                            <option value="Orang Tua Tunggal">Orang Tua Tunggal</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Penghasilan Bulanan Keluarga
                                        </label>
                                        <select
                                            value={form.penghasilan}
                                            onChange={(e) => setForm({ ...form, penghasilan: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                        >
                                            <option value="< Rp 3.500.000 / bulan">&lt; Rp 3.500.000 / bulan</option>
                                            <option value="Rp 3.500.000 - Rp 7.500.000 / bulan">Rp 3.500.000 - Rp 7.500.000 / bulan</option>
                                            <option value="Rp 7.500.000 - Rp 15.000.000 / bulan">Rp 7.500.000 - Rp 15.000.000 / bulan</option>
                                            <option value="> Rp 15.000.000 / bulan">&gt; Rp 15.000.000 / bulan</option>
                                        </select>
                                    </div>

                                    {/* Pekerjaan + Custom */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Pekerjaan Utama
                                        </label>
                                        <select
                                            value={form.pekerjaan}
                                            onChange={(e) => setForm({ ...form, pekerjaan: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                        >
                                            <option value="Pegawai Swasta / BUMN">Pegawai Swasta / BUMN</option>
                                            <option value="ASN / TNI / Polri">ASN / TNI / Polri</option>
                                            <option value="Wirausaha / Pengusaha">Wirausaha / Pengusaha</option>
                                            <option value="Lainnya">Lainnya (Input Manual)</option>
                                        </select>
                                        {form.pekerjaan === 'Lainnya' && (
                                            <input
                                                type="text"
                                                required
                                                value={form.pekerjaanCustom}
                                                onChange={(e) => setForm({ ...form, pekerjaanCustom: e.target.value })}
                                                placeholder="Tuliskan pekerjaan Anda..."
                                                className="mt-2 w-full px-3.5 py-2 rounded-lg border border-primary/50 bg-emerald-50/30 text-sm"
                                            />
                                        )}
                                    </div>

                                    {/* Tempat Tinggal + Custom */}
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Status Tempat Tinggal
                                        </label>
                                        <select
                                            value={form.tempatTinggal}
                                            onChange={(e) => setForm({ ...form, tempatTinggal: e.target.value })}
                                            className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                        >
                                            <option value="Rumah Milik Sendiri">Rumah Milik Sendiri</option>
                                            <option value="Rumah Keluarga / Orang Tua">Rumah Keluarga / Orang Tua</option>
                                            <option value="Kontrak / Sewa Tahunan">Kontrak / Sewa Tahunan</option>
                                            <option value="Lainnya">Lainnya (Input Manual)</option>
                                        </select>
                                        {form.tempatTinggal === 'Lainnya' && (
                                            <input
                                                type="text"
                                                required
                                                value={form.tempatTinggalCustom}
                                                onChange={(e) => setForm({ ...form, tempatTinggalCustom: e.target.value })}
                                                placeholder="Jelaskan status tempat tinggal..."
                                                className="mt-2 w-full px-3.5 py-2 rounded-lg border border-primary/50 bg-emerald-50/30 text-sm"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Alasan & Kesiapan */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Alasan Mengajukan Adopsi
                                    </label>
                                    <select
                                        value={form.alasanAdopsi}
                                        onChange={(e) => setForm({ ...form, alasanAdopsi: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                    >
                                        <option value="Ingin memberikan kasih sayang & pendidikan layak">
                                            Ingin memberikan kasih sayang &amp; pendidikan layak
                                        </option>
                                        <option value="Belum dikaruniai keturunan setelah menikah lama">
                                            Belum dikaruniai keturunan setelah menikah lama
                                        </option>
                                        <option value="Menjalankan amanah sosial & ibadah">
                                            Menjalankan amanah sosial &amp; ibadah
                                        </option>
                                        <option value="Lainnya">Lainnya (Input Manual)</option>
                                    </select>
                                    {form.alasanAdopsi === 'Lainnya' && (
                                        <input
                                            type="text"
                                            required
                                            value={form.alasanAdopsiCustom}
                                            onChange={(e) => setForm({ ...form, alasanAdopsiCustom: e.target.value })}
                                            placeholder="Tuliskan alasan pengajuan adopsi..."
                                            className="mt-2 w-full px-3.5 py-2 rounded-lg border border-primary/50 bg-emerald-50/30 text-sm"
                                        />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Kesiapan Dokumen Legal (Dinsos)
                                    </label>
                                    <select
                                        value={form.kesiapanDokumen}
                                        onChange={(e) => setForm({ ...form, kesiapanDokumen: e.target.value })}
                                        className="w-full px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-sm"
                                    >
                                        <option value="Lengkap (KTP, KK, Akta Nikah, SKCK, Ket. Sehat)">
                                            Lengkap (KTP, KK, Akta Nikah, SKCK, Ket. Sehat)
                                        </option>
                                        <option value="Sebagian (Sedang Mengurus SKCK / Ket. Sehat)">
                                            Sebagian (Sedang Mengurus SKCK / Ket. Sehat)
                                        </option>
                                        <option value="Belum Lengkap">Belum Lengkap</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Alamat Domisili Lengkap *
                                </label>
                                <textarea
                                    rows="2"
                                    required
                                    value={form.alamat}
                                    onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                                    placeholder="Jalan, RT/RW, Kecamatan, Kabupaten/Kota, Provinsi"
                                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div className="pt-2 flex justify-end">
                                <button type="submit" className="btn-primary text-sm py-2.5 px-6">
                                    Kirim Pengajuan Adopsi
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
}
