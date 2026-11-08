import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    ClockIcon
} from '@heroicons/react/24/outline';

export default function Contact() {
    return (
        <section id="contact" className="py-12 lg:py-16 bg-surface border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        Sekretariat & Kunjungan
                    </span>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-slate-900 mt-0.5">
                        Hubungi Panti Asuhan As-Sholihin
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="card-surface p-5">
                        <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-3">
                            <MapPinIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Alamat Asrama</h3>
                        <p className="text-xs text-slate-600 mt-1">
                            Desa Candimulyo, Kec. Jombang, Kab. Jombang, Jawa Timur 61413
                        </p>
                    </div>

                    <div className="card-surface p-5">
                        <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-3">
                            <PhoneIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Layanan WhatsApp</h3>
                        <p className="text-xs text-slate-600 mt-1">+62 812-3456-7890</p>
                    </div>

                    <div className="card-surface p-5">
                        <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-3">
                            <EnvelopeIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Email Yayasan</h3>
                        <p className="text-xs text-slate-600 mt-1">sekretariat@assholihin-jombang.or.id</p>
                    </div>

                    <div className="card-surface p-5">
                        <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center mb-3">
                            <ClockIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900">Jam Kunjungan</h3>
                        <p className="text-xs text-slate-600 mt-1">Senin – Ahad: 08.00 – 17.00 WIB</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
