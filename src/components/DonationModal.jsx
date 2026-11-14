import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    XMarkIcon,
    LockClosedIcon,
    CheckCircleIcon,
    QrCodeIcon,
    BuildingLibraryIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

const PREDEFINED_AMOUNTS = [
    { label: 'Rp 25.000', value: 25000 },
    { label: 'Rp 50.000', value: 50000 },
    { label: 'Rp 100.000', value: 100000 },
    { label: 'Rp 250.000', value: 250000 },
    { label: 'Rp 500.000', value: 500000 },
    { label: 'Rp 1.000.000', value: 1000000 },
];

export default function DonationModal({ isOpen, setIsOpen, initialData }) {
    const [loading, setLoading] = useState(false);
    const [paymentTab, setPaymentTab] = useState('gateway'); // 'gateway' | 'qris_static'
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [activePrograms, setActivePrograms] = useState([]);
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        nominal: 50000,
        program: 'Santunan & Pendidikan Anak Yatim',
        pesan: '',
        no_wa: ''
    });

    useEffect(() => {
        try {
            const raw = localStorage.getItem('assholihin_admin_programs');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    setActivePrograms(parsed);
                    if (!initialData?.program && parsed[0]?.title) {
                        setFormData((prev) => ({ ...prev, program: parsed[0].title }));
                    }
                }
            }
        } catch {}
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setFormData((prev) => ({
                ...prev,
                nominal: initialData.amount || prev.nominal,
                program: initialData.program || prev.program
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAmountClick = (amount) => {
        setFormData({ ...formData, nominal: amount });
    };

    const formatIDR = (val) => {
        if (!val) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const donorName = isAnonymous ? 'Hamba Allah' : (formData.nama || 'Hamba Allah');

        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
            const response = await axios.post(`${baseUrl}/v1/donation`, {
                donor_name: donorName,
                nama: donorName,
                donor_email: formData.email || 'donatur@assholihin.or.id',
                email: formData.email || 'donatur@assholihin.or.id',
                amount: formData.nominal,
                nominal: formData.nominal,
                program: formData.program,
                no_wa: formData.no_wa,
                pesan: formData.pesan ? `[${formData.program}] ${formData.pesan}` : `Donasi ${formData.program}`
            });

            if (response.data.status === 'success' || response.data.success) {
                const snapToken = response.data.token || response.data.data?.token;
                const paymentUrl = response.data.payment_url || response.data.data?.payment_url;
                const orderId = response.data.invoice_number || response.data.data?.order_id;

                if (orderId) {
                    const nowIso = new Date().toISOString();
                    const expiresAtIso = response.data.expires_at || response.data.data?.expires_at || new Date(Date.now() + 15 * 60 * 1000).toISOString();
                    localStorage.setItem('last_order_id', orderId);
                    const metaObj = {
                        order_id: orderId,
                        customer_name: donorName,
                        customer_email: formData.email || 'donatur@assholihin.or.id',
                        amount: Number(formData.nominal),
                        program: formData.program,
                        payment_url: paymentUrl,
                        created_at: nowIso,
                        expires_at: expiresAtIso
                    };
                    localStorage.setItem(`donasi_meta_${orderId}`, JSON.stringify(metaObj));

                    // Simpan ke riwayat donasi di Portal Donatur
                    try {
                        const existingHistory = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
                        const formattedDate = new Intl.DateTimeFormat('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }).format(new Date());

                        const newEntry = {
                            id: orderId,
                            donorName: donorName,
                            email: formData.email || 'donatur@assholihin.or.id',
                            no_wa: formData.no_wa || '',
                            date: formattedDate,
                            program: formData.program,
                            amount: Number(formData.nominal),
                            method: 'MIDTRANS SNAP',
                            status: 'Menunggu Pembayaran',
                            created_at: nowIso,
                            expires_at: expiresAtIso
                        };
                        const filtered = existingHistory.filter(item => item.id !== orderId);
                        localStorage.setItem('assholihin_donor_history', JSON.stringify([newEntry, ...filtered]));
                        window.dispatchEvent(new Event('assholihin-history-change'));
                    } catch (e) {
                        console.error(e);
                    }
                }

                if (snapToken && window.snap) {
                    setIsOpen(false);
                    setLoading(false);
                    window.snap.pay(snapToken, {
                        onSuccess: (result) => {
                            try {
                                const hist = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
                                const updated = hist.map(item =>
                                    item.id === (result.order_id || orderId)
                                        ? {
                                            ...item,
                                            method: (result.payment_type || 'Midtrans Snap').replace(/_/g, ' ').toUpperCase(),
                                            status: 'Berhasil'
                                        }
                                        : item
                                );
                                localStorage.setItem('assholihin_donor_history', JSON.stringify(updated));
                            } catch (e) {}
                            window.location.href = `/success?order_id=${result.order_id || orderId}`;
                        },
                        onPending: (result) => {
                            try {
                                const hist = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
                                const updated = hist.map(item =>
                                    item.id === (result.order_id || orderId)
                                        ? {
                                            ...item,
                                            method: (result.payment_type || 'Midtrans Snap').replace(/_/g, ' ').toUpperCase(),
                                            status: 'Menunggu Pembayaran'
                                        }
                                        : item
                                );
                                localStorage.setItem('assholihin_donor_history', JSON.stringify(updated));
                            } catch (e) {}
                            window.location.href = `/pending?order_id=${result.order_id || orderId}`;
                        },
                        onError: (result) => {
                            console.error('Midtrans Payment Error:', result);
                        },
                        onClose: () => {
                            console.log('Popup Midtrans ditutup oleh donatur');
                        }
                    });
                } else if (paymentUrl) {
                    setIsOpen(false);
                    window.location.href = paymentUrl;
                } else {
                    throw new Error('Token pembayaran Midtrans belum tersedia');
                }
            } else {
                throw new Error(response.data.message || 'Gagal memproses transaksi');
            }
        } catch (error) {
            console.error('Donation Error:', error);
            // Fallback to QRIS Static tab if API gateway is not yet active on local
            setPaymentTab('qris_static');
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog onClose={closeModal} className="relative z-50">
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-elevated overflow-hidden">
                                {/* Modal Header */}
                                <div className="px-6 py-4 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
                                    <div>
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                                            Formulir Donasi Resmi
                                        </span>
                                        <Dialog.Title className="text-base sm:text-lg font-bold text-slate-900">
                                            Panti Asuhan As-Sholihin Jombang
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Payment Mode Tabs */}
                                <div className="px-6 pt-4 bg-white border-b border-slate-100 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentTab('gateway')}
                                        className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                                            paymentTab === 'gateway'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        <BuildingLibraryIcon className="w-4 h-4" />
                                        <span>Checkout Otomatis (VA / E-Wallet)</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentTab('qris_static')}
                                        className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
                                            paymentTab === 'qris_static'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-slate-500 hover:text-slate-800'
                                        }`}
                                    >
                                        <QrCodeIcon className="w-4 h-4" />
                                        <span>Scan QRIS Resmi (NMID)</span>
                                    </button>
                                </div>

                                {paymentTab === 'gateway' ? (
                                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                                        {/* Selected Program */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                                Akad & Program Penyaluran
                                            </label>
                                            <select
                                                name="program"
                                                value={formData.program}
                                                onChange={handleChange}
                                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50/50 text-sm font-semibold text-slate-800 focus:outline-none focus:border-primary"
                                            >
                                                {activePrograms.length > 0 ? (
                                                    activePrograms.map((p) => (
                                                        <option key={p.id} value={p.title}>
                                                            {p.title} ({p.category})
                                                        </option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option value="Santunan & Pendidikan Anak Yatim">Santunan & Pendidikan Anak Yatim</option>
                                                        <option value="Pemenuhan Pangan & Gizi Asrama">Pemenuhan Pangan & Gizi Asrama</option>
                                                        <option value="Zakat Maal / Zakat Penghasilan">Zakat Maal / Zakat Penghasilan</option>
                                                        <option value="Sedekah Subuh & Operasional Panti">Sedekah Subuh & Operasional Panti</option>
                                                        <option value="Wakaf Pemeliharaan Asrama">Wakaf Pemeliharaan Asrama</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        {/* Nominal Selection */}
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-600 mb-2">
                                                Pilih Nominal Donasi
                                            </label>
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {PREDEFINED_AMOUNTS.map((item) => (
                                                    <button
                                                        key={item.value}
                                                        type="button"
                                                        onClick={() => handleAmountClick(item.value)}
                                                        className={`py-2 px-3 rounded-lg text-xs font-semibold border tabular-nums transition-all ${
                                                            Number(formData.nominal) === item.value
                                                                ? 'border-primary bg-primary-light text-primary ring-1 ring-primary'
                                                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-sm font-bold text-slate-400">
                                                    Rp
                                                </span>
                                                <input
                                                    type="number"
                                                    name="nominal"
                                                    min="10000"
                                                    required
                                                    value={formData.nominal}
                                                    onChange={handleChange}
                                                    placeholder="Masukkan nominal lainnya"
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-primary tabular-nums"
                                                />
                                            </div>
                                        </div>

                                        {/* Donor Identity */}
                                        <div className="space-y-3 pt-1">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-semibold text-slate-600">
                                                    Identitas Donatur
                                                </label>
                                                <label className="inline-flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAnonymous}
                                                        onChange={(e) => setIsAnonymous(e.target.checked)}
                                                        className="rounded border-slate-300 text-primary focus:ring-primary"
                                                    />
                                                    <span className="text-xs font-medium text-slate-700">
                                                        Sembunyikan nama (Hamba Allah)
                                                    </span>
                                                </label>
                                            </div>

                                            {!isAnonymous && (
                                                <input
                                                    type="text"
                                                    name="nama"
                                                    required={!isAnonymous}
                                                    value={formData.nama}
                                                    onChange={handleChange}
                                                    placeholder="Nama Lengkap Anda"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                />
                                            )}

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <input
                                                    type="tel"
                                                    name="no_wa"
                                                    required
                                                    value={formData.no_wa}
                                                    onChange={handleChange}
                                                    placeholder="No. WhatsApp (Untuk E-Kwitansi)"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                />
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email (Opsional)"
                                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                                />
                                            </div>

                                            <textarea
                                                name="pesan"
                                                rows="2"
                                                value={formData.pesan}
                                                onChange={handleChange}
                                                placeholder="Tuliskan doa atau niat kebaikan untuk diaminkan bersama santri..."
                                                className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                            />
                                        </div>

                                        {/* Summary & Submit */}
                                        <div className="pt-3 border-t border-slate-100">
                                            <div className="flex items-center justify-between text-sm mb-4">
                                                <span className="text-slate-600 font-medium">Total Donasi:</span>
                                                <span className="text-lg font-bold text-primary tabular-nums">
                                                    {formatIDR(formData.nominal)}
                                                </span>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full py-3 px-5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                            >
                                                {loading ? (
                                                    <span>Memproses Koneksi Gateway...</span>
                                                ) : (
                                                    <>
                                                        <LockClosedIcon className="w-4 h-4" />
                                                        <span>Bayar Sekarang ({formatIDR(formData.nominal)})</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                ) : (
                                    /* QRIS Resmi LKSA As-Sholihin */
                                    <div className="p-6 text-center space-y-4">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                                            <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
                                            <span>QRIS Resmi Standar Nasional (NMID: ID1026507480998)</span>
                                        </div>

                                        <div className="max-w-xs mx-auto p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                            <img
                                                src={`${import.meta.env.BASE_URL}img/qris_assholihin.jpg`}
                                                alt="QRIS LKSA As Sholihin"
                                                className="w-full h-auto rounded-lg"
                                            />
                                        </div>

                                        <div className="text-xs text-slate-600 max-w-md mx-auto space-y-1">
                                            <p className="font-semibold text-slate-900">
                                                A.n. LKSA AS SHOLIHIN — Candimulyo Jombang
                                            </p>
                                            <p>
                                                Dapat dipindai menggunakan BCA Mobile, Livin&apos; Mandiri, BRImo, BSI Mobile, GoPay, OVO, DANA, atau ShopeePay.
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-center">
                                            <a
                                                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                                    `Assalamu'alaikum Admin Panti Asuhan As-Sholihin, saya telah berdonasi via QRIS sebesar ${formatIDR(
                                                        formData.nominal
                                                    )} untuk program ${formData.program}. Mohon konfirmasi pencatatan kasnya. Terima kasih.`
                                                )}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="btn-primary justify-center"
                                            >
                                                Konfirmasi Bukti Transfer via WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
