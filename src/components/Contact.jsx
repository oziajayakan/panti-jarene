import { useState } from 'react';
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Terima kasih! Pesan Anda telah dicatat oleh sekretariat Panti Asuhan As-Sholihin.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <section id="contact" className="py-16 lg:py-24 bg-white border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mb-12">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Layanan Donatur & Sekretariat
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                        Hubungi & Kunjungi Panti Asuhan As-Sholihin
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                        Kami terbuka bagi Bapak/Ibu dermawan yang ingin bersilaturahmi langsung ke asrama, menyalurkan bantuan logistik secara langsung, maupun berkonsultasi mengenai program Orang Tua Asuh.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Official Contact & Address Details (5 Cols) */}
                    <div className="lg:col-span-5 space-y-5">
                        <div className="card-surface p-6 space-y-5">
                            <div className="flex items-start gap-3.5">
                                <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPinIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Alamat Asrama & Sekretariat</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                        Yayasan Assholihin Candimulyo Jombang<br />
                                        Desa Candimulyo, Kec. Jombang, Kabupaten Jombang,<br />
                                        Jawa Timur 61413
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                                <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <PhoneIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Telepon & WhatsApp Careline</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                        +62 812-3456-7890 (Konfirmasi Donasi & Layanan Tamu)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                                <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <EnvelopeIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Email Resmi Yayasan</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                        sekretariat@assholihin-jombang.or.id
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3.5 pt-4 border-t border-slate-100">
                                <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0 mt-0.5">
                                    <ClockIcon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">Jam Operasional Kunjungan</h3>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                        Senin – Ahad: 08.00 – 17.00 WIB
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Direct Inquiry Form (7 Cols) */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-8 space-y-4">
                            <h3 className="text-base font-bold text-slate-900">
                                Kirim Pesan atau Jadwalkan Kunjungan Silaturahmi
                            </h3>
                            <p className="text-xs text-slate-500">
                                Tim pengurus kami akan merespons pesan Anda melalui email atau WhatsApp.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Nama Anda"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                        Email atau No. WhatsApp
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="0812xxxx / email@domain.com"
                                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Pesan / Keperluan
                                </label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tuliskan pertanyaan, rencana kunjungan, atau konfirmasi penyaluran..."
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <button type="submit" className="btn-primary">
                                Kirim Pesan ke Sekretariat
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
