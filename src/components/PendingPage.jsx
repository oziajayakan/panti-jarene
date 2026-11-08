
import { useState, useEffect, Fragment } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Dialog, Transition } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function PendingPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Get Order ID from URL or State
    const orderId = searchParams.get('order_id') || location.state?.order_id;

    const [loading, setLoading] = useState(true);
    const [orderData, setOrderData] = useState(null);
    const [isCancelling, setIsCancelling] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    useEffect(() => {
        let interval;
        if (orderId) {
            checkStatus();
            // Polling every 5 seconds
            interval = setInterval(() => {
                checkStatus(true); // true = silent mode (no loading spinner full screen)
            }, 5000);
        } else {
            // If no order ID, go home
            setTimeout(() => navigate('/'), 2000);
        }
        return () => clearInterval(interval);
    }, [orderId]);

    const checkStatus = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
            const localMetaRaw = localStorage.getItem(`donasi_meta_${orderId}`);
            const localMeta = localMetaRaw ? JSON.parse(localMetaRaw) : null;

            const response = await axios.get(`${baseUrl}/landing/payment/status/${orderId}?t=${Date.now()}`);

            if (response.data && response.data.success) {
                const merged = {
                    ...(localMeta || {}),
                    ...response.data.data,
                    customer_name: localMeta?.customer_name || response.data.data.customer_name || 'Donatur As-Sholihin',
                    customer_email: localMeta?.customer_email || response.data.data.customer_email || 'donatur@assholihin.or.id'
                };
                setOrderData(merged);

                // If paid, redirect to success
                if (merged.status === 'paid' || merged.status === 'success') {
                    navigate(`/success?order_id=${orderId}`);
                }
            } else if (localMeta) {
                setOrderData({ ...localMeta, status: 'pending', payment_channel: 'MIDTRANS SNAP' });
            }
        } catch (error) {
            console.error("Error fetching status:", error);
            const localMetaRaw = localStorage.getItem(`donasi_meta_${orderId}`);
            if (localMetaRaw) {
                setOrderData({ ...JSON.parse(localMetaRaw), status: 'pending', payment_channel: 'MIDTRANS SNAP' });
            }
        } finally {
            if (!silent) setLoading(false);
        }
    };

    const handleCancelClick = () => {
        setIsCancelModalOpen(true);
    };

    const confirmCancel = async () => {
        setIsCancelling(true);
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
            const response = await axios.post(`${baseUrl}/landing/payment/cancel`, { order_id: orderId });

            if (response.data.success) {
                navigate('/');
            } else {
                alert("Gagal membatalkan transaksi.");
            }
        } catch (error) {
            console.error("Cancel error:", error);
            alert("Terjadi kesalahan saat membatalkan transaksi.");
        } finally {
            setIsCancelling(false);
            setIsCancelModalOpen(false);
        }
    };

    const handlePay = () => {
        if (orderData?.payment_url) {
            window.open(orderData.payment_url, '_blank');
        } else if (location.state?.payment_url) {
            window.open(location.state.payment_url, '_blank');
        } else {
            alert("Link pembayaran tidak ditemukan.");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Transaksi Tidak Ditemukan</h1>
                <p className="text-slate-500 mb-4">Mohon maaf, data transaksi tidak ditemukan.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-primary text-white rounded-lg">Kembali ke Beranda</button>
            </div>
        );
    }

    // If cancelled
    if (orderData.status === 'cancelled' || orderData.status === 'failed') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                <div className="size-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
                    <span className="material-symbols-outlined text-4xl">cancel</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Transaksi Dibatalkan</h1>
                <p className="text-slate-500 mb-8 max-w-md">Transaksi ini telah dibatalkan atau kadaluarsa.</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                    Kembali ke Beranda
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-body py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden relative">
                {/* Decorative Top */}
                <div className="h-2 bg-amber-400 w-full absolute top-0"></div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <div className="relative inline-flex items-center justify-center size-20 mb-4">
                            <div className="absolute inset-0 bg-amber-100 rounded-full animate-ping opacity-75"></div>
                            <div className="relative size-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 border border-amber-100">
                                <span className="material-symbols-outlined text-4xl animate-pulse">hourglass_top</span>
                            </div>
                        </div>

                        <h2 className="text-2xl font-heading font-bold text-slate-800">Menunggu Pembayaran</h2>
                        <p className="text-slate-500 text-sm mt-2 px-4">
                            Sistem sedang memantau status pembayaran Anda secara otomatis...
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 relative overflow-hidden">
                        {/* Shimmer loading effect */}
                        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 dashed relative z-10">
                            <span className="text-sm text-slate-500">Total Pembayaran</span>
                            <span className="text-xl font-bold text-primary">{formatCurrency(orderData.amount)}</span>
                        </div>
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Order ID</span>
                                <span className="font-mono font-medium text-slate-700">{orderData.order_id}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Metode</span>
                                <span className="font-medium text-slate-700">{orderData.payment_channel || orderData.payment_method}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Status</span>
                                <span className="inline-flex items-center gap-1.5 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-xs">
                                    <span className="size-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    Pending
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handlePay}
                            className="w-full py-4 px-6 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <span>Buka Halaman Pembayaran</span>
                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                        </button>

                        <button
                            onClick={() => checkStatus()}
                            className="w-full py-3 px-6 text-sm font-semibold text-primary hover:text-primary-dark transition-colors flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">refresh</span>
                            Cek Status Manual
                        </button>

                        <button
                            onClick={handleCancelClick}
                            className="w-full py-3 px-6 text-sm text-slate-400 hover:text-red-500 transition-colors"
                        >
                            Batalkan Transaksi
                        </button>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <Transition show={isCancelModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={() => setIsCancelModalOpen(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 z-10 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                enterTo="opacity-100 translate-y-0 sm:scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            >
                                <Dialog.Panel className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm">
                                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                        <div className="sm:flex sm:items-start">
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                            </div>
                                            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                                <Dialog.Title as="h3" className="text-lg font-heading font-bold leading-6 text-slate-900">
                                                    Batalkan Transaksi?
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    <p className="text-sm text-slate-500">
                                                        Apakah Anda yakin ingin membatalkan transaksi ini?
                                                        Tindakan ini tidak dapat dibatalkan.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-xl bg-red-600 px-3 py-2 text-sm font-bold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={confirmCancel}
                                            disabled={isCancelling}
                                        >
                                            {isCancelling ? 'Memproses...' : 'Ya, Batalkan'}
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setIsCancelModalOpen(false)}
                                            disabled={isCancelling}
                                        >
                                            Tidak
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
