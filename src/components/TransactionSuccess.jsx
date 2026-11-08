import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Confetti from 'react-confetti';
import {
    PrinterIcon,
    ShareIcon,
    HomeIcon,
    ArrowDownTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

export default function TransactionSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderIdParam = searchParams.get('order_id');

    const [paymentData, setPaymentData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    // Window resize for confetti
    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch payment status
    const fetchStatus = () => {
        if (!orderIdParam) {
            setLoading(false);
            setError('Order ID tidak ditemukan');
            return Promise.resolve(false);
        }

        const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
        const localMetaRaw = localStorage.getItem(`donasi_meta_${orderIdParam}`);
        const localMeta = localMetaRaw ? JSON.parse(localMetaRaw) : null;

        return axios.get(`${baseUrl}/landing/payment/status/${orderIdParam}?t=${Date.now()}`)
            .then(response => {
                let shouldStop = false;
                if (response.data && response.data.success) {
                    const merged = {
                        ...(localMeta || {}),
                        ...response.data.data,
                        customer_name: localMeta?.customer_name || response.data.data.customer_name || 'Donatur As-Sholihin',
                        customer_email: localMeta?.customer_email || response.data.data.customer_email || 'donatur@assholihin.or.id'
                    };
                    setPaymentData(merged);
                    // Stop polling if status is final
                    if (['success', 'paid', 'expired', 'failed'].includes(merged.status)) {
                        shouldStop = true;
                    }
                    // Sinkronkan juga ke riwayat Portal Donatur
                    try {
                        const existingHistory = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
                        const formattedDate = new Intl.DateTimeFormat('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        }).format(new Date(merged.created_at || Date.now()));
                        const entry = {
                            id: merged.order_id,
                            date: formattedDate,
                            program: merged.program || 'Santunan & Pendidikan Anak Yatim',
                            amount: Number(merged.amount || 50000),
                            method: (merged.payment_channel || 'Midtrans Snap').replace(/_/g, ' '),
                            status: ['success', 'paid'].includes(merged.status) ? 'Berhasil (Settlement)' : 'Menunggu Pembayaran'
                        };
                        const idx = existingHistory.findIndex(h => h.id === merged.order_id);
                        if (idx >= 0) {
                            existingHistory[idx] = { ...existingHistory[idx], ...entry };
                        } else {
                            existingHistory.unshift(entry);
                        }
                        localStorage.setItem('assholihin_donor_history', JSON.stringify(existingHistory));
                    } catch (e) {}
                } else if (localMeta) {
                    setPaymentData({ ...localMeta, status: 'paid', payment_channel: 'MIDTRANS SNAP' });
                    shouldStop = true;
                } else {
                    setError('Data transaksi tidak ditemukan');
                }
                setLoading(false);
                return shouldStop;
            })
            .catch(error => {
                console.error('Error fetching payment status:', error);
                if (localMeta) {
                    setPaymentData({ ...localMeta, status: 'paid', payment_channel: 'MIDTRANS SNAP' });
                } else {
                    setError('Gagal memuat status pembayaran');
                }
                setLoading(false);
                return true;
            });
    };

    // Initial fetch and polling
    useEffect(() => {
        let attemptCount = 0;
        const maxAttempts = 90; // 3 minutes

        fetchStatus().then(shouldStop => {
            if (!shouldStop) {
                const interval = setInterval(() => {
                    attemptCount++;
                    if (attemptCount >= maxAttempts) {
                        clearInterval(interval);
                        return;
                    }
                    fetchStatus().then(stop => {
                        if (stop) clearInterval(interval);
                    });
                }, 2000);
                return () => clearInterval(interval);
            }
        });
    }, [orderIdParam]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const shareWhatsApp = () => {
        const text = `Alhamdulillah, saya telah berdonasi sebesar ${formatCurrency(paymentData.amount)} untuk Panti Asuhan Assholihin. No. Ref: ${paymentData.order_id}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    // Determine status
    const isFailed = paymentData?.status === 'failed';
    const isExpired = paymentData?.status === 'expired';
    const isPending = paymentData?.status === 'pending';
    const isConfirmed = paymentData?.status === 'success' || paymentData?.status === 'paid';

    if (loading || !paymentData) {
        return (
            <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-slate-300 border-t-slate-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-mono text-sm">LOADING RECEIPT...</p>
                </div>
            </div>
        );
    }

    // Receipt Component
    return (
        <div className="min-h-screen bg-slate-100 py-8 px-4 flex items-center justify-center selection:bg-slate-200 selection:text-slate-900 print:bg-white print:p-0">
            {isConfirmed && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={500}
                    gravity={0.2}
                    colors={['#1e293b', '#334155', '#475569', '#94a3b8']}
                    className="print:hidden"
                />
            )}

            <div className="w-full max-w-md print:w-full print:max-w-none">

                {/* RECEIPT CARD */}
                <div className="bg-white shadow-2xl overflow-hidden relative print:shadow-none print:border print:border-slate-300">

                    {/* Top Decorative Edge (CSS Zigzag) */}
                    <div className="h-3 bg-slate-900 w-full relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '8px 8px' }}></div>
                    </div>

                    <div className="p-8 pb-12 relative bg-repeat opacity-100" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}img/pattern.svg')` }}>
                        {/* Watermark/Background Pattern */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none flex items-center justify-center overflow-hidden">
                            <span className="text-[150px] font-black rotate-[-30deg] select-none tracking-widest">
                                {isConfirmed ? 'PAID' : isPending ? 'PENDING' : 'VOID'}
                            </span>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8 border-b-2 border-dashed border-slate-200 pb-8 relative z-10">
                            <div className="flex justify-center mb-4">
                                <img src={`${import.meta.env.BASE_URL}img/logo.png`} alt="Logo" className="h-20 w-auto grayscale opacity-90 mix-blend-multiply" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-widest uppercase font-serif">KUITANSI DONASI</h1>
                            <div className="flex justify-center items-center gap-2 mt-2">
                                <div className="h-px w-8 bg-slate-300"></div>
                                <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em]">Official Receipt</p>
                                <div className="h-px w-8 bg-slate-300"></div>
                            </div>
                        </div>

                        {/* Status Badge - Modern style */}
                        <div className="flex justify-center mb-8">
                            <div className={`
                                inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider
                                ${isConfirmed ? 'bg-green-50 border-green-200 text-green-700' :
                                    isPending ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                        'bg-red-50 border-red-200 text-red-700'}
                             `}>
                                <div className={`w-2 h-2 rounded-full ${isPending ? 'animate-pulse bg-amber-500' : isConfirmed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {isConfirmed ? 'Lunas / Paid' : isPending ? 'Menunggu Pembayaran' : 'Gagal / Failed'}
                            </div>
                        </div>

                        {/* Main Details */}
                        <div className="space-y-4 font-mono text-sm mb-8 relative z-10">
                            <div className="flex justify-between items-baseline group">
                                <span className="text-slate-500 text-xs uppercase tracking-wider group-hover:text-slate-800 transition-colors">No. Ref</span>
                                <span className="text-slate-900 font-bold tracking-tight">{paymentData.order_id}</span>
                            </div>
                            <div className="flex justify-between items-baseline group">
                                <span className="text-slate-500 text-xs uppercase tracking-wider group-hover:text-slate-800 transition-colors">Tanggal</span>
                                <span className="text-slate-900">{formatDate(paymentData.created_at)}</span>
                            </div>
                            {/* DOKU Reference if available */}
                            {paymentData.doku_invoice_id && (
                                <div className="flex justify-between items-baseline group">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider group-hover:text-slate-800 transition-colors">Invoice Ref</span>
                                    <span className="text-slate-900">{paymentData.doku_invoice_id}</span>
                                </div>
                            )}
                        </div>

                        {/* Separator */}
                        <div className="border-t-2 border-dashed border-slate-200 my-8 relative">
                            {/* Scissors Icon */}
                            <div className="absolute -top-3 left-0 -translate-x-1/2 bg-white px-1 text-slate-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                                </svg>
                            </div>
                        </div>

                        {/* Customer & Payment Info */}
                        <div className="space-y-6 mb-8 relative z-10">
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">Donatur</div>
                                <div>
                                    <p className="text-lg text-slate-900 font-serif font-bold leading-none mb-1">{paymentData.customer_name}</p>
                                    <p className="text-slate-500 text-xs font-mono">{paymentData.customer_email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">Metode</div>
                                <div>
                                    <p className="text-slate-900 font-mono font-medium text-sm">
                                        {paymentData.payment_channel ? paymentData.payment_channel.replace(/_/g, ' ') : 'Online Payment'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-1">Perihal</div>
                                <div className="bg-slate-50 border border-slate-100 p-3 rounded-tr-xl rounded-bl-xl text-slate-700 text-sm font-serif italic relative">
                                    <span className="absolute -top-2 -left-1 text-4xl text-slate-200 font-serif leading-none">"</span>
                                    Donasi untuk Program Panti Asuhan Assholihin
                                    <span className="absolute -bottom-4 -right-1 text-4xl text-slate-200 font-serif leading-none">"</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Amount Box */}
                        <div className="bg-slate-900 text-white p-6 mb-10 text-center relative mt-8 rounded-lg shadow-lg">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-slate-900 px-3 py-0.5 text-slate-900 text-[10px] font-bold uppercase tracking-widest rounded-full">TOTAL DONASI</div>
                            <div className="text-4xl font-bold font-mono tracking-tight">
                                {formatCurrency(paymentData.amount)}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">Terima kasih atas kebaikan Anda</div>
                        </div>

                        {/* Stamp Effect - Fixed orientation and visibility */}
                        {isConfirmed && (
                            <div className="absolute bottom-24 right-8 rotate-[-15deg] opacity-90 pointer-events-none mix-blend-multiply z-20">
                                <div className="border-[6px] border-double border-green-800 text-green-800 px-6 py-2 rounded-lg shadow-sm">
                                    <div className="text-3xl font-black uppercase tracking-[0.2em]">LUNAS</div>
                                    <div className="text-[10px] font-mono text-center font-bold border-t border-green-800 mt-1 pt-0.5">
                                        {formatDate(paymentData.updated_at || new Date()).split(' pukul')[0]}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Footer */}
                        <div className="text-center pt-8 relative z-10">
                            <div className="flex justify-center items-end gap-16 mb-4">
                                <div className="text-center">
                                    <div className="h-16 w-32 mx-auto relative mb-2">
                                        <div className="absolute bottom-0 left-0 right-0 border-b border-slate-300"></div>
                                        <div className="absolute inset-0 flex items-end justify-center pb-2 font-handwriting text-2xl text-slate-400 rotate-[-5deg] opacity-60">Admin</div>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">Authorized By</p>
                                </div>
                            </div>
                            <p className="font-serif italic text-slate-500 text-xs mt-6">
                                "Semoga Allah SWT membalas kebaikan Anda dengan pahala yang berlipat ganda."
                            </p>
                        </div>

                        {/* Cut Line (Bottom) */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-[length:20px_20px] bg-repeat-x z-20" style={{
                            backgroundImage: 'radial-gradient(circle at 10px 20px, transparent 10px, #ffffff 10px)',
                            transform: 'rotate(180deg)',
                            marginBottom: '-1px' // Fix gap
                        }}></div>
                    </div>
                </div>

                {/* Decorative shadow under the receipt */}
                <div className="mx-4 h-4 bg-slate-900/5 rounded-full blur-xl -mt-2 mb-8"></div>

                {/* Actions (Outside Receipt) */}
                <div className="flex flex-col gap-3 print:hidden">
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/')}
                            className="flex-1 px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center gap-2 group text-sm"
                        >
                            <HomeIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                            Beranda
                        </button>

                        <button
                            onClick={() => window.print()}
                            className="flex-1 px-4 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 flex items-center justify-center gap-2 text-sm"
                        >
                            <PrinterIcon className="w-4 h-4" />
                            Cetak / Simpan
                        </button>
                    </div>

                    <button
                        onClick={shareWhatsApp}
                        className="w-full px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-[#25D366]/30 flex items-center justify-center gap-2 text-sm"
                    >
                        <ShareIcon className="w-4 h-4" />
                        Bagikan Kebaikan via WhatsApp
                    </button>
                </div>

                <div className="mt-8 text-center print:hidden opacity-50 hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
                        System Generated Receipt • {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
