import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    Squares2X2Icon,
    BanknotesIcon,
    ArrowsRightLeftIcon,
    UserGroupIcon,
    PhotoIcon,
    DocumentChartBarIcon,
    ArrowRightOnRectangleIcon,
    PlusIcon,
    TrashIcon,
    PencilSquareIcon,
    CheckBadgeIcon,
    ArrowPathIcon,
    PrinterIcon,
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    KeyIcon,
    HomeIcon,
    Bars3Icon,
    XMarkIcon,
    CheckCircleIcon,
    BellAlertIcon,
    ArrowUpTrayIcon
} from '@heroicons/react/24/outline';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const DEFAULT_ADMIN_ACCOUNTS = [
    {
        id: 1,
        name: 'Administrator As-Sholihin',
        email: 'admin@panti.com',
        password: 'password',
        role: 'ADMIN',
        jabatan: 'Administrator Utama Yayasan'
    }
];

const DEFAULT_ANAK_ASUH = [
    {
        id: 1,
        nama: 'Ahmad Fauzi',
        jk: 'Laki-laki',
        usia: 14,
        kategori: 'Yatim Piatu',
        jenjang: 'SMP Kelas 8',
        sekolah: 'MTsN Candimulyo Jombang',
        hafalan: '4 Juz (Juz 27-30)',
        kesehatan: 'Sehat Baik',
        statusMukim: 'Mukim Asrama'
    },
    {
        id: 2,
        nama: 'Siti Aisyah',
        jk: 'Perempuan',
        usia: 11,
        kategori: 'Yatim',
        jenjang: 'SD Kelas 5',
        sekolah: 'MI As-Sholihin',
        hafalan: '2 Juz (Juz 29-30)',
        kesehatan: 'Sehat Baik',
        statusMukim: 'Mukim Asrama'
    },
    {
        id: 3,
        nama: 'Muhammad Rizky Pratama',
        jk: 'Laki-laki',
        usia: 16,
        kategori: 'Yatim',
        jenjang: 'SMA Kelas 11',
        sekolah: 'MAN 1 Jombang',
        hafalan: '6 Juz',
        kesehatan: 'Sehat Baik',
        statusMukim: 'Mukim Asrama'
    },
    {
        id: 4,
        nama: 'Nurul Hidayah',
        jk: 'Perempuan',
        usia: 13,
        kategori: 'Piatu',
        jenjang: 'SMP Kelas 7',
        sekolah: 'SMP Islam Candimulyo',
        hafalan: '3 Juz',
        kesehatan: 'Sehat Baik',
        statusMukim: 'Mukim Asrama'
    },
    {
        id: 5,
        nama: 'Bagas Saputra',
        jk: 'Laki-laki',
        usia: 9,
        kategori: 'Dhuafa',
        jenjang: 'SD Kelas 3',
        sekolah: 'SDN Candimulyo 1',
        hafalan: 'Juz 30',
        kesehatan: 'Sehat Baik',
        statusMukim: 'Non-Mukim (Binaan)'
    }
];

const DEFAULT_KAS_TRANSACTIONS = [
    {
        id: 'KAS-20261101-01',
        tanggal: '05 Nov 2026',
        jenis: 'MASUK',
        kategori: 'Dana Infaq & Sedekah',
        uraian: 'Penerimaan Donasi QRIS & Virtual Account Mingguan',
        nominal: 12500000,
        pj: 'Administrator Yayasan'
    },
    {
        id: 'KAS-20261102-02',
        tanggal: '06 Nov 2026',
        jenis: 'KELUAR',
        kategori: 'Pangan & Gizi Asrama',
        uraian: 'Belanja Beras 250 Kg, Telur, Sayur & Lauk Pauk Santri Mukim',
        nominal: 4850000,
        pj: 'Logistik Asrama'
    },
    {
        id: 'KAS-20261103-03',
        tanggal: '07 Nov 2026',
        jenis: 'KELUAR',
        kategori: 'Beasiswa & Pendidikan',
        uraian: 'Pembayaran SPP, Buku Paket & Seragam 15 Santri SMP/SMA',
        nominal: 5200000,
        pj: 'Bidang Pendidikan'
    },
    {
        id: 'KAS-20261104-04',
        tanggal: '08 Nov 2026',
        jenis: 'MASUK',
        kategori: 'Dana Zakat Maal',
        uraian: 'Setoran Zakat Penghasilan Donatur Tetap Bulan November',
        nominal: 8500000,
        pj: 'Administrator Yayasan'
    },
    {
        id: 'KAS-20261105-05',
        tanggal: '08 Nov 2026',
        jenis: 'KELUAR',
        kategori: 'Operasional & Utilitas Asrama',
        uraian: 'Tagihan Listrik PLN, Air Bersih, Internet & Kebersihan Asrama',
        nominal: 2150000,
        pj: 'Kepala Asrama'
    }
];

const DEFAULT_GALLERY_ITEMS = [
    {
        id: 1,
        category: 'Pendidikan & Tahfidz',
        date: 'Oktober 2026',
        title: 'Halaqah Tahfidz Al-Qur’an & Setoran Hafalan Sore Santri Asuh',
        description:
            'Pembinaan rutin hafalan Al-Qur’an juz 30 serta murajaah bersama ustadz pembina di musholla asrama Panti Asuhan As-Sholihin Candimulyo.',
        image_url:
            'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 2,
        category: 'Beasiswa Sekolah',
        date: 'Oktober 2026',
        title: 'Penyaluran Beasiswa Pendidikan, Tas & Perlengkapan Sekolah Baru',
        description:
            'Pembagian seragam, sepatu, tas, dan buku tulis dari dana amanah donatur untuk menunjang semangat belajar anak-anak asuh tingkat SD, SMP, dan SMA.',
        image_url:
            'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 3,
        category: 'Pangan & Gizi Asrama',
        date: 'September 2026',
        title: 'Pemenuhan Gizi Harian & Makan Bersama Santri Mukim',
        description:
            'Penyediaan menu makanan sehat bergizi seimbang tiga kali sehari serta pembagian susu dan vitamin bagi seluruh santri mukim.',
        image_url:
            'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 4,
        category: 'Keagamaan & Doa Bersama',
        date: 'September 2026',
        title: 'Istighosah & Majelis Doa Bersama untuk Keberkahan Para Donatur',
        description:
            'Kegiatan rutin malam Jumat pembacaan Yasin, Tahlil, dan doa khusus bagi keselamatan, kesehatan, serta kelapangan rezeki seluruh donatur Yayasan Assholihin.',
        image_url:
            'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 5,
        category: 'Sosial Kemanusiaan',
        date: 'Agustus 2026',
        title: 'Santunan Sembako & Uang Saku Yatim Non-Mukim Sekitar Candimulyo',
        description:
            'Penyaluran paket beras, minyak goreng, dan santunan tunai kepada keluarga wali yatim dan lansia dhuafa di lingkungan sekitar panti asuhan.',
        image_url:
            'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80'
    },
    {
        id: 6,
        category: 'Asrama & Kemandirian',
        date: 'Agustus 2026',
        title: 'Bimbingan Belajar Malam & Pelatihan Komputer Santri',
        description:
            'Pendampingan mengerjakan tugas sekolah dan pelatihan literasi komputer dasar bagi santri tingkat SMP dan SMA di ruang belajar asrama.',
        image_url: `${import.meta.env.BASE_URL}img/hero-bg.jpg`
    }
];

const SAMPLE_DONATIONS = [
    {
        id: 'ORD-20261031-091',
        donorName: 'H. Ahmad Syarifuddin',
        email: 'donatur@panti.com',
        date: '31 Okt 2026',
        program: 'Beasiswa SPP & Pendidikan Santri Yatim',
        amount: 250000,
        method: 'QRIS Nasional',
        status: 'Berhasil (Settlement)'
    },
    {
        id: 'ORD-20261015-044',
        donorName: 'Bpk. Hendra Wijaya',
        email: 'hendra@gmail.com',
        date: '15 Okt 2026',
        program: 'Pemenuhan Pangan & Gizi Asrama',
        amount: 100000,
        method: 'BSI Virtual Account',
        status: 'Berhasil (Settlement)'
    }
];

export default function AdminDashboard() {
    // 1. Auth State Admin (Hanya 1 Akun Admin)
    const [adminUser, setAdminUser] = useState(() => {
        try {
            const raw = localStorage.getItem('assholihin_admin_session');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    const [loginForm, setLoginForm] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');

    // 2. Navigation & Notification State
    const [activeMenu, setActiveMenu] = useState('overview'); // 'overview' | 'donations' | 'kas' | 'anak' | 'gallery' | 'laporan'
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [lastSeenNotifId, setLastSeenNotifId] = useState(() => localStorage.getItem('assholihin_last_notif_id') || '');

    // 3. Data States (Persisted in localStorage & Synced with Public Landing Page)
    const [anakList, setAnakList] = useState(() => {
        try {
            const raw = localStorage.getItem('assholihin_admin_anak');
            if (raw) return JSON.parse(raw);
            localStorage.setItem('assholihin_admin_anak', JSON.stringify(DEFAULT_ANAK_ASUH));
            return DEFAULT_ANAK_ASUH;
        } catch {
            return DEFAULT_ANAK_ASUH;
        }
    });

    const [kasList, setKasList] = useState(() => {
        try {
            const raw = localStorage.getItem('assholihin_admin_kas');
            if (raw) return JSON.parse(raw);
            localStorage.setItem('assholihin_admin_kas', JSON.stringify(DEFAULT_KAS_TRANSACTIONS));
            return DEFAULT_KAS_TRANSACTIONS;
        } catch {
            return DEFAULT_KAS_TRANSACTIONS;
        }
    });

    const [galleryList, setGalleryList] = useState(() => {
        try {
            const raw = localStorage.getItem('assholihin_admin_gallery');
            if (raw) return JSON.parse(raw);
            localStorage.setItem('assholihin_admin_gallery', JSON.stringify(DEFAULT_GALLERY_ITEMS));
            return DEFAULT_GALLERY_ITEMS;
        } catch {
            return DEFAULT_GALLERY_ITEMS;
        }
    });

    const [donationList, setDonationList] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
            return [...saved, ...SAMPLE_DONATIONS];
        } catch {
            return SAMPLE_DONATIONS;
        }
    });

    const [isSyncingMidtrans, setIsSyncingMidtrans] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Form States for Modals / Inline Forms
    const [showAnakForm, setShowAnakForm] = useState(false);
    const [editingAnakId, setEditingAnakId] = useState(null);
    const [anakForm, setAnakForm] = useState({
        nama: '',
        jk: 'Laki-laki',
        usia: 12,
        kategori: 'Yatim',
        jenjang: 'SMP Kelas 7',
        sekolah: '',
        hafalan: 'Juz 30',
        kesehatan: 'Sehat Baik',
        statusMukim: 'Mukim Asrama'
    });

    const [showKasForm, setShowKasForm] = useState(false);
    const [kasForm, setKasForm] = useState({
        jenis: 'KELUAR',
        kategori: 'Pangan & Gizi Asrama',
        uraian: '',
        nominal: 500000,
        pj: 'Administrator Yayasan'
    });

    const [showManualDonationForm, setShowManualDonationForm] = useState(false);
    const [manualDonationForm, setManualDonationForm] = useState({
        donorName: '',
        program: 'Santunan & Pendidikan Anak Yatim',
        amount: 100000,
        method: 'Tunai / Kas Sekretariat',
        status: 'Berhasil (Settlement)'
    });

    // Gallery CRUD State (Create, Edit, Upload File)
    const [showGalleryForm, setShowGalleryForm] = useState(false);
    const [editingGalleryId, setEditingGalleryId] = useState(null);
    const [galleryForm, setGalleryForm] = useState({
        title: '',
        category: 'Pendidikan & Tahfidz',
        date: 'November 2026',
        description: '',
        image_url: ''
    });

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(''), 4000);
    };

    // Persist changes & broadcast to LandingPage
    useEffect(() => {
        localStorage.setItem('assholihin_admin_anak', JSON.stringify(anakList));
        window.dispatchEvent(new Event('assholihin-data-updated'));
    }, [anakList]);

    useEffect(() => {
        localStorage.setItem('assholihin_admin_kas', JSON.stringify(kasList));
        window.dispatchEvent(new Event('assholihin-data-updated'));
    }, [kasList]);

    useEffect(() => {
        localStorage.setItem('assholihin_admin_gallery', JSON.stringify(galleryList));
        window.dispatchEvent(new Event('assholihin-data-updated'));
    }, [galleryList]);

    // Auto-Polling Midtrans Transactions & Live Notifications
    const syncMidtransOrders = async (silent = true) => {
        if (!silent) setIsSyncingMidtrans(true);
        try {
            const saved = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
            const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

            // 0. Scan seluruh donasi_meta_DONASI-* di localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('donasi_meta_')) {
                    try {
                        const meta = JSON.parse(localStorage.getItem(key));
                        if (meta && meta.order_id && !saved.some((s) => s.id === meta.order_id)) {
                            const formattedDate = new Intl.DateTimeFormat('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).format(new Date(meta.created_at || Date.now()));
                            saved.unshift({
                                id: meta.order_id,
                                donorName: meta.customer_name || 'Hamba Allah',
                                email: meta.customer_email || '-',
                                date: formattedDate,
                                program: meta.program || 'Santunan & Pendidikan Anak Yatim',
                                amount: Number(meta.amount || 50000),
                                method: (meta.payment_channel || 'MIDTRANS SNAP').replace(/_/g, ' '),
                                status: ['paid', 'success'].includes(meta.status)
                                    ? 'Berhasil (Settlement)'
                                    : 'Menunggu Pembayaran'
                            });
                        }
                    } catch {}
                }
            }

            // 1. Ambil daftar order dari server (/api/orders yang otomatis cek ke Midtrans)
            try {
                const res = await fetch(`${baseUrl}/orders?t=${Date.now()}`);
                if (res.ok) {
                    const serverOrders = await res.json();
                    if (Array.isArray(serverOrders)) {
                        serverOrders.forEach((so) => {
                            const formattedDate = new Intl.DateTimeFormat('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                            }).format(new Date(so.created_at || Date.now()));
                            const mapped = {
                                id: so.order_id,
                                donorName: so.customer_name || 'Hamba Allah',
                                email: so.customer_email || '-',
                                date: formattedDate,
                                program: so.program || 'Santunan & Pendidikan Anak Yatim',
                                amount: Number(so.amount || 50000),
                                method: (so.payment_channel || 'MIDTRANS SNAP').replace(/_/g, ' '),
                                status: ['paid', 'success'].includes(so.status)
                                    ? 'Berhasil (Settlement)'
                                    : ['expired', 'failed', 'cancelled'].includes(so.status)
                                    ? 'Dibatalkan / Kedaluwarsa'
                                    : 'Menunggu Pembayaran'
                            };
                            const idx = saved.findIndex((item) => item.id === mapped.id);
                            if (idx >= 0) {
                                saved[idx] = { ...saved[idx], ...mapped };
                            } else {
                                saved.unshift(mapped);
                            }
                        });
                    }
                }
            } catch {}

            // 2. Ambil daftar notifikasi live dari server (/api/notification)
            try {
                const notifRes = await fetch(`${baseUrl}/notification?t=${Date.now()}`);
                if (notifRes.ok) {
                    const notifData = await notifRes.json();
                    if (Array.isArray(notifData)) {
                        setNotifications(notifData);
                        if (notifData.length > 0) {
                            const newest = notifData[0];
                            const storedLast = localStorage.getItem('assholihin_last_notif_id');
                            if (newest.id && newest.id !== storedLast) {
                                localStorage.setItem('assholihin_last_notif_id', newest.id);
                                setLastSeenNotifId(newest.id);
                                showToast(`🔔 ${newest.title}: ${newest.message}`);
                            }
                        }
                    }
                }
            } catch {}

            // 3. Cek status individual ke Midtrans untuk setiap transaksi yang ada
            await Promise.all(
                saved.map(async (item, index) => {
                    if (!item.id || item.id.startsWith('ORD-') || item.id.startsWith('MANUAL-')) return;
                    try {
                        const metaRaw = localStorage.getItem(`donasi_meta_${item.id}`);
                        const meta = metaRaw ? JSON.parse(metaRaw) : null;
                        const statusRes = await fetch(
                            `${baseUrl}/landing/payment/status/${encodeURIComponent(item.id)}?t=${Date.now()}`
                        );
                        if (statusRes.ok) {
                            const statusJson = await statusRes.json();
                            if (statusJson?.success && statusJson?.data) {
                                const d = statusJson.data;
                                const newStatus = ['paid', 'success'].includes(d.status)
                                    ? 'Berhasil (Settlement)'
                                    : ['expired', 'failed', 'cancelled'].includes(d.status)
                                    ? 'Dibatalkan / Kedaluwarsa'
                                    : 'Menunggu Pembayaran';

                                if (item.status !== 'Berhasil (Settlement)' && newStatus === 'Berhasil (Settlement)') {
                                    showToast(
                                        `✅ Donasi ${item.donorName || d.customer_name || 'Donatur'} (${item.id}) telah LUNAS!`
                                    );
                                }

                                saved[index] = {
                                    ...item,
                                    donorName: item.donorName || meta?.customer_name || d.customer_name || 'Hamba Allah',
                                    amount: Number(d.amount || item.amount),
                                    method: (d.payment_channel || item.method || 'MIDTRANS SNAP').replace(/_/g, ' '),
                                    status: newStatus
                                };
                            }
                        }
                    } catch {}
                })
            );

            localStorage.setItem('assholihin_donor_history', JSON.stringify(saved));
            setDonationList([...saved, ...SAMPLE_DONATIONS]);
            if (!silent) showToast('Data donatur & status Midtrans berhasil disinkronkan!');
        } catch {
            // fallback
        } finally {
            if (!silent) setIsSyncingMidtrans(false);
        }
    };

    useEffect(() => {
        if (!adminUser) return;
        syncMidtransOrders(true);
        const interval = setInterval(() => syncMidtransOrders(true), 3000);
        window.addEventListener('storage', () => syncMidtransOrders(true));
        return () => clearInterval(interval);
    }, [adminUser]);

    // Formatters
    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(Number(val) || 0);
    };

    // Computed Financial Metrics
    const totalSettledDonations = donationList
        .filter(
            (d) =>
                (d.status || '').toLowerCase().includes('berhasil') ||
                (d.status || '').toLowerCase().includes('settlement')
        )
        .reduce((acc, cur) => acc + Number(cur.amount || 0), 0);

    const totalKasMasuk = kasList
        .filter((k) => k.jenis === 'MASUK')
        .reduce((acc, cur) => acc + Number(cur.nominal || 0), 0);

    const totalKasKeluar = kasList
        .filter((k) => k.jenis === 'KELUAR')
        .reduce((acc, cur) => acc + Number(cur.nominal || 0), 0);

    const basePemasukan = 218550000 + totalSettledDonations + totalKasMasuk;
    const basePengeluaran = 183000000 + totalKasKeluar;
    const saldoAkhir = 84620000 + totalSettledDonations + totalKasMasuk - totalKasKeluar;

    // Handlers Auth (Hanya Admin)
    const handleAdminLogin = (e) => {
        e.preventDefault();
        setLoginError('');
        const found = DEFAULT_ADMIN_ACCOUNTS.find(
            (acc) =>
                acc.email.toLowerCase() === loginForm.email.trim().toLowerCase() &&
                acc.password === loginForm.password
        );
        if (!found) {
            setLoginError('Email atau kata sandi Administrator salah.');
            return;
        }
        localStorage.setItem('assholihin_admin_session', JSON.stringify(found));
        setAdminUser(found);
    };

    const handleAdminLogout = () => {
        localStorage.removeItem('assholihin_admin_session');
        setAdminUser(null);
    };

    // Handlers Anak Asuh
    const handleSaveAnak = (e) => {
        e.preventDefault();
        if (editingAnakId) {
            setAnakList((prev) =>
                prev.map((a) =>
                    a.id === editingAnakId ? { ...anakForm, id: editingAnakId, usia: Number(anakForm.usia) } : a
                )
            );
            showToast('Data anak asuh berhasil diperbarui.');
        } else {
            const newEntry = {
                ...anakForm,
                id: Date.now(),
                usia: Number(anakForm.usia)
            };
            setAnakList((prev) => [newEntry, ...prev]);
            showToast('Data anak asuh baru berhasil ditambahkan.');
        }
        setShowAnakForm(false);
        setEditingAnakId(null);
        setAnakForm({
            nama: '',
            jk: 'Laki-laki',
            usia: 12,
            kategori: 'Yatim',
            jenjang: 'SMP Kelas 7',
            sekolah: '',
            hafalan: 'Juz 30',
            kesehatan: 'Sehat Baik',
            statusMukim: 'Mukim Asrama'
        });
    };

    const handleEditAnak = (anak) => {
        setEditingAnakId(anak.id);
        setAnakForm(anak);
        setShowAnakForm(true);
    };

    const handleDeleteAnak = (id) => {
        setAnakList((prev) => prev.filter((a) => a.id !== id));
        showToast('Data anak asuh telah dihapus.');
    };

    // Handlers Kas PSAK 109
    const handleSaveKas = (e) => {
        e.preventDefault();
        const formattedDate = new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date());

        const newKas = {
            id: `KAS-${Date.now().toString().slice(-6)}`,
            tanggal: formattedDate,
            jenis: kasForm.jenis,
            kategori: kasForm.kategori,
            uraian: kasForm.uraian,
            nominal: Number(kasForm.nominal),
            pj: kasForm.pj || adminUser?.name || 'Administrator Yayasan'
        };
        setKasList((prev) => [newKas, ...prev]);
        setShowKasForm(false);
        setKasForm({
            jenis: 'KELUAR',
            kategori: 'Pangan & Gizi Asrama',
            uraian: '',
            nominal: 500000,
            pj: 'Administrator Yayasan'
        });
        showToast('Transaksi buku kas berhasil dicatat & disinkronkan ke halaman depan.');
    };

    const handleDeleteKas = (id) => {
        setKasList((prev) => prev.filter((k) => k.id !== id));
        showToast('Catatan kas berhasil dihapus.');
    };

    // Handlers Manual Donation
    const handleSaveManualDonation = (e) => {
        e.preventDefault();
        const formattedDate = new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).format(new Date());

        const orderId = `MANUAL-${Date.now().toString().slice(-6)}`;
        const newDonation = {
            id: orderId,
            donorName: manualDonationForm.donorName || 'Hamba Allah',
            date: formattedDate,
            program: manualDonationForm.program,
            amount: Number(manualDonationForm.amount),
            method: manualDonationForm.method,
            status: manualDonationForm.status
        };

        const saved = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
        const updated = [newDonation, ...saved];
        localStorage.setItem('assholihin_donor_history', JSON.stringify(updated));
        localStorage.setItem(
            `donasi_meta_${orderId}`,
            JSON.stringify({
                order_id: orderId,
                customer_name: newDonation.donorName,
                customer_email: 'donatur@assholihin.or.id',
                amount: newDonation.amount,
                program: newDonation.program,
                payment_channel: newDonation.method,
                status: 'paid',
                created_at: new Date().toISOString()
            })
        );
        setDonationList([...updated, ...SAMPLE_DONATIONS]);
        setShowManualDonationForm(false);
        setManualDonationForm({
            donorName: '',
            program: 'Santunan & Pendidikan Anak Yatim',
            amount: 100000,
            method: 'Tunai / Kas Sekretariat',
            status: 'Berhasil (Settlement)'
        });
        window.dispatchEvent(new Event('assholihin-data-updated'));
        showToast('Donasi manual berhasil dicatat dan E-Kwitansi diterbitkan!');
    };

    const handleApproveDonationStatus = (orderId) => {
        const saved = JSON.parse(localStorage.getItem('assholihin_donor_history') || '[]');
        const updated = saved.map((item) =>
            item.id === orderId ? { ...item, status: 'Berhasil (Settlement)' } : item
        );
        localStorage.setItem('assholihin_donor_history', JSON.stringify(updated));
        setDonationList([...updated, ...SAMPLE_DONATIONS]);
        window.dispatchEvent(new Event('assholihin-data-updated'));
        showToast(`Order ${orderId} diverifikasi menjadi Berhasil (Settlement).`);
    };

    // Handlers Gallery CRUD (Upload Gambar File + Edit Postingan + Hapus)
    const handleImageFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 4 * 1024 * 1024) {
            showToast('Ukuran gambar maksimal 4 MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                setGalleryForm((prev) => ({ ...prev, image_url: reader.result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveGallery = (e) => {
        e.preventDefault();
        const finalImage =
            galleryForm.image_url ||
            'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=900&q=80';

        if (editingGalleryId) {
            setGalleryList((prev) =>
                prev.map((item) =>
                    item.id === editingGalleryId
                        ? {
                              ...item,
                              title: galleryForm.title,
                              category: galleryForm.category,
                              date: galleryForm.date || item.date,
                              description: galleryForm.description,
                              image_url: finalImage
                          }
                        : item
                )
            );
            showToast('Postingan kegiatan galeri berhasil diperbarui!');
        } else {
            const newItem = {
                id: Date.now(),
                title: galleryForm.title,
                category: galleryForm.category,
                date: galleryForm.date || 'November 2026',
                description: galleryForm.description,
                image_url: finalImage
            };
            setGalleryList((prev) => [newItem, ...prev]);
            showToast('Dokumentasi kegiatan baru berhasil dipublikasikan ke Galeri Depan!');
        }

        setShowGalleryForm(false);
        setEditingGalleryId(null);
        setGalleryForm({
            title: '',
            category: 'Pendidikan & Tahfidz',
            date: 'November 2026',
            description: '',
            image_url: ''
        });
    };

    const handleEditGallery = (item) => {
        setEditingGalleryId(item.id);
        setGalleryForm({
            title: item.title,
            category: item.category,
            date: item.date,
            description: item.description,
            image_url: item.image_url
        });
        setShowGalleryForm(true);
    };

    const handleDeleteGallery = (id) => {
        setGalleryList((prev) => prev.filter((g) => g.id !== id));
        showToast('Postingan galeri telah dihapus.');
    };

    // Export CSV
    const handleExportCSV = () => {
        const headers = ['ID Referensi,Tanggal,Jenis,Kategori/Program,Uraian/Donatur,Nominal (IDR),Status'];
        const rows = [
            ...donationList.map(
                (d) =>
                    `${d.id},${d.date},DONASI MASUK,"${d.program}","${d.donorName || 'Hamba Allah'}",${d.amount},"${d.status}"`
            ),
            ...kasList.map(
                (k) =>
                    `${k.id},${k.tanggal},KAS ${k.jenis},"${k.kategori}","${k.uraian}",${k.nominal},Terverifikasi`
            )
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `LPJ_Keuangan_Assholihin_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('File CSV Laporan Keuangan berhasil diunduh!');
    };

    // ============================================================================
    // VIEW 1: LOGIN ADMIN (HANYA 1 AKUN ADMIN TANPA BENDAHARA)
    // ============================================================================
    if (!adminUser) {
        return (
            <div className="min-h-screen bg-surface flex flex-col justify-between">
                <header className="bg-primary text-white py-3 border-b border-emerald-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 font-medium">
                            <ShieldCheckIcon className="w-4 h-4 text-emerald-300" />
                            <span>Sistem Informasi Manajemen & Audit Kas (PSAK 109) — LKSA Panti Asuhan As-Sholihin</span>
                        </div>
                        <Link to="/" className="text-emerald-200 hover:text-white font-semibold flex items-center gap-1">
                            <HomeIcon className="w-3.5 h-3.5" />
                            <span>Kembali ke Web Publik</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-elevated overflow-hidden">
                        <div className="p-6 sm:p-8 bg-primary text-white">
                            <div className="flex items-center gap-3.5 mb-3">
                                <img
                                    src={`${import.meta.env.BASE_URL}img/logo.png`}
                                    alt="Logo Assholihin"
                                    className="w-12 h-12 rounded-xl bg-white p-1 object-contain"
                                />
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-200 block">
                                        Portal Administrator Resmi
                                    </span>
                                    <h1 className="text-lg sm:text-xl font-heading font-bold">
                                        Dashboard Admin Panti
                                    </h1>
                                </div>
                            </div>
                            <p className="text-xs text-emerald-100 leading-relaxed">
                                Masuk sebagai Administrator untuk mengelola transaksi Midtrans, buku kas PSAK 109, data anak asuh, dan publikasi galeri kegiatan.
                            </p>
                        </div>

                        <form onSubmit={handleAdminLogin} className="p-6 sm:p-8 space-y-4">
                            {loginError && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700">
                                    {loginError}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Email Administrator
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={loginForm.email}
                                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                    placeholder="admin@panti.com"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Kata Sandi
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={loginForm.password}
                                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-primary"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
                            >
                                <KeyIcon className="w-4 h-4" />
                                <span>Masuk ke Dashboard Admin</span>
                            </button>

                            {/* Quick Fill Single Admin Demo Credential */}
                            <div className="pt-4 border-t border-slate-100">
                                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Akun Administrator (Klik untuk Isi Otomatis):
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setLoginForm({ email: 'admin@panti.com', password: 'password' })}
                                    className="w-full p-3 rounded-lg border border-slate-200 hover:border-primary hover:bg-primary-light/50 text-left transition-all flex items-center justify-between"
                                >
                                    <div>
                                        <span className="text-xs font-bold text-slate-800 block">
                                            Administrator As-Sholihin
                                        </span>
                                        <span className="text-[11px] font-mono text-slate-500">
                                            Email: admin@panti.com | Sandi: password
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-semibold text-primary">Isi Otomatis →</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </main>

                <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
                    © {new Date().getFullYear()} Yayasan Assholihin Candimulyo Jombang — Sistem Manajemen Terpadu
                </footer>
            </div>
        );
    }

    // ============================================================================
    // VIEW 2: MAIN ADMIN DASHBOARD LAYOUT
    // ============================================================================
    const menuItems = [
        { id: 'overview', label: 'Ringkasan Dashboard', icon: Squares2X2Icon },
        { id: 'donations', label: 'Donasi & Midtrans', icon: BanknotesIcon, badge: donationList.length },
        { id: 'kas', label: 'Buku Kas PSAK 109', icon: ArrowsRightLeftIcon },
        { id: 'anak', label: 'Data Anak Asuh', icon: UserGroupIcon, badge: anakList.length },
        { id: 'gallery', label: 'Galeri Kegiatan', icon: PhotoIcon, badge: galleryList.length },
        { id: 'laporan', label: 'Laporan LPJ & Export', icon: DocumentChartBarIcon }
    ];

    const chartDataConfig = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            {
                label: 'Pemasukan Donasi & Kas',
                data: [
                    14500000,
                    16200000,
                    18900000,
                    22400000,
                    15800000,
                    19300000,
                    21000000,
                    17500000,
                    20400000,
                    24100000,
                    28450000 + totalSettledDonations + totalKasMasuk,
                    0
                ],
                borderColor: '#0D6B41',
                backgroundColor: 'rgba(13, 107, 65, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.35
            },
            {
                label: 'Realisasi Belanja Operasional',
                data: [
                    12100000,
                    14800000,
                    15200000,
                    19600000,
                    14300000,
                    16900000,
                    18200000,
                    15900000,
                    17800000,
                    18900000,
                    19300000 + totalKasKeluar,
                    0
                ],
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.05)',
                borderWidth: 2,
                borderDash: [4, 4],
                fill: false,
                tension: 0.35
            }
        ]
    };

    const filteredDonations = donationList.filter((d) => {
        const matchSearch =
            (d.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.donorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (d.program || '').toLowerCase().includes(searchQuery.toLowerCase());

        if (statusFilter === 'ALL') return matchSearch;
        const isPaid =
            (d.status || '').toLowerCase().includes('berhasil') ||
            (d.status || '').toLowerCase().includes('settlement');
        if (statusFilter === 'PAID') return matchSearch && isPaid;
        if (statusFilter === 'PENDING') return matchSearch && !isPaid;
        return matchSearch;
    });

    return (
        <div className="min-h-screen bg-surface flex flex-col lg:flex-row">
            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-elevated border border-slate-700 flex items-center gap-2.5 text-xs sm:text-sm font-medium max-w-md">
                    <CheckCircleIcon className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Sidebar Desktop & Mobile */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-white flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
                    mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div>
                    <div className="p-5 border-b border-emerald-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={`${import.meta.env.BASE_URL}img/logo.png`}
                                alt="Logo"
                                className="w-10 h-10 rounded-lg bg-white p-0.5 object-contain"
                            />
                            <div>
                                <span className="font-heading font-bold text-sm text-white block leading-tight">
                                    AS-SHOLIHIN
                                </span>
                                <span className="text-[11px] text-emerald-300 font-medium block">
                                    Dashboard Admin
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMobileSidebarOpen(false)}
                            className="lg:hidden text-emerald-200 hover:text-white"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-3 space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-emerald-300/70">
                            Menu Manajemen Utama
                        </div>
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const active = activeMenu === item.id;
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => {
                                        setActiveMenu(item.id);
                                        setMobileSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                        active
                                            ? 'bg-primary text-white shadow-xs ring-1 ring-emerald-500/40'
                                            : 'text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white'
                                    }`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Icon className="w-5 h-5 shrink-0" />
                                        <span>{item.label}</span>
                                    </span>
                                    {item.badge !== undefined && (
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold tabular-nums ${
                                                active ? 'bg-white text-primary' : 'bg-emerald-800 text-emerald-200'
                                            }`}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="p-4 border-t border-emerald-800/60 space-y-2 bg-emerald-950/40">
                    <Link
                        to="/"
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-200 hover:bg-emerald-900/60 hover:text-white transition-colors"
                    >
                        <HomeIcon className="w-4 h-4" />
                        <span>Lihat Website Publik</span>
                    </Link>
                    <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-red-300 hover:bg-red-950/50 hover:text-red-200 transition-colors"
                    >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        <span>Keluar Sesi Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar with Live Notification Bell */}
                <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
                    <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-base sm:text-lg font-heading font-bold text-slate-900">
                                    {menuItems.find((m) => m.id === activeMenu)?.label}
                                </h1>
                                <p className="text-[11px] text-slate-500 hidden sm:block">
                                    Yayasan Assholihin Candimulyo Jombang • Auto-Sync Midtrans Aktif
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Live Notification Bell */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                                    className="relative p-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                                    title="Notifikasi Donatur Masuk"
                                >
                                    <BellAlertIcon className="w-5 h-5 text-primary" />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {showNotifDropdown && (
                                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-elevated z-50 overflow-hidden">
                                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                                            <span className="text-xs font-bold text-slate-900">
                                                Notifikasi Donatur & Midtrans ({notifications.length})
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setShowNotifDropdown(false)}
                                                className="text-[11px] text-slate-500 hover:text-slate-800"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-xs text-slate-400">
                                                    Belum ada notifikasi transaksi baru.
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div
                                                        key={n.id}
                                                        onClick={() => {
                                                            setActiveMenu('donations');
                                                            setShowNotifDropdown(false);
                                                        }}
                                                        className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <span className="text-xs font-bold text-slate-900">
                                                                {n.title}
                                                            </span>
                                                            <span
                                                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                                                    n.status === 'paid'
                                                                        ? 'bg-emerald-50 text-emerald-700'
                                                                        : 'bg-amber-50 text-amber-700'
                                                                }`}
                                                            >
                                                                {n.status === 'paid' ? 'LUNAS' : 'BARU'}
                                                            </span>
                                                        </div>
                                                        <p className="text-[11px] text-slate-600 mt-1">{n.message}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => syncMidtransOrders(false)}
                                disabled={isSyncingMidtrans}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                            >
                                <ArrowPathIcon className={`w-4 h-4 text-primary ${isSyncingMidtrans ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">Sinkronkan</span>
                            </button>

                            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center border border-emerald-200">
                                    A
                                </div>
                                <div className="hidden md:block text-left">
                                    <span className="text-xs font-bold text-slate-900 block leading-none">
                                        {adminUser.name}
                                    </span>
                                    <span className="text-[10px] font-semibold text-primary block mt-0.5">
                                        {adminUser.jabatan}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Body */}
                <main className="p-4 sm:p-6 lg:p-8 space-y-6 flex-1">
                    {/* ==================================================================== */}
                    {/* TAB 1: OVERVIEW DASHBOARD (Tanpa Banner Hijau Selamat Datang) */}
                    {/* ==================================================================== */}
                    {activeMenu === 'overview' && (
                        <div className="space-y-6">
                            {/* 4 KPI Summary Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Saldo Kas Aktif</span>
                                        <span className="p-2 rounded-lg bg-emerald-50 text-primary">
                                            <BanknotesIcon className="w-5 h-5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 tabular-nums">
                                        {formatIDR(saldoAkhir)}
                                    </div>
                                    <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                                        Rekening BSI & Kas Tunai
                                    </span>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Total Pemasukan</span>
                                        <span className="p-2 rounded-lg bg-blue-50 text-blue-700">
                                            <CheckBadgeIcon className="w-5 h-5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 tabular-nums">
                                        {formatIDR(basePemasukan)}
                                    </div>
                                    <span className="text-[11px] text-slate-500 mt-1 block">
                                        Termasuk Midtrans Settlement
                                    </span>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Realisasi Pengeluaran</span>
                                        <span className="p-2 rounded-lg bg-amber-50 text-amber-700">
                                            <ArrowsRightLeftIcon className="w-5 h-5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 tabular-nums">
                                        {formatIDR(basePengeluaran)}
                                    </div>
                                    <span className="text-[11px] text-slate-500 mt-1 block">
                                        Pendidikan, Pangan & Asrama
                                    </span>
                                </div>

                                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-card">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-semibold text-slate-500">Anak Asuh Terbina</span>
                                        <span className="p-2 rounded-lg bg-primary-light text-primary">
                                            <UserGroupIcon className="w-5 h-5" />
                                        </span>
                                    </div>
                                    <div className="text-xl font-bold text-slate-900 tabular-nums">
                                        {anakList.length} <span className="text-sm font-medium text-slate-500">Santri</span>
                                    </div>
                                    <span className="text-[11px] text-slate-500 mt-1 block">
                                        Mukim & Non-Mukim Aktif
                                    </span>
                                </div>
                            </div>

                            {/* Chart + Recent Midtrans Orders */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                                <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-card">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900">
                                                Arus Kas Yayasan (Pemasukan vs Pengeluaran)
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                Data terhubung dengan grafik halaman transparansi publik
                                            </p>
                                        </div>
                                        <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                                            Tahun Buku 2026
                                        </span>
                                    </div>
                                    <div className="h-72">
                                        <Line
                                            data={chartDataConfig}
                                            options={{
                                                responsive: true,
                                                maintainAspectRatio: false,
                                                plugins: { legend: { position: 'top' } }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-card flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                                    <span>Donasi & Notifikasi Masuk</span>
                                                </h3>
                                                <p className="text-xs text-slate-500">
                                                    Otomatis terbaca saat donatur bertransaksi
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setActiveMenu('donations')}
                                                className="text-xs font-semibold text-primary hover:underline"
                                            >
                                                Lihat Semua
                                            </button>
                                        </div>

                                        <div className="divide-y divide-slate-100">
                                            {donationList.slice(0, 6).map((item) => {
                                                const isPaid =
                                                    (item.status || '').toLowerCase().includes('berhasil') ||
                                                    (item.status || '').toLowerCase().includes('settlement');
                                                return (
                                                    <div key={item.id} className="py-3 flex items-center justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p className="text-xs font-bold text-slate-900 truncate">
                                                                {item.donorName || 'Hamba Allah'}{' '}
                                                                <span className="font-mono font-normal text-slate-400">
                                                                    ({item.id})
                                                                </span>
                                                            </p>
                                                            <p className="text-[11px] text-slate-500 truncate">
                                                                {item.program} • {item.method}
                                                            </p>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-xs font-bold text-primary tabular-nums">
                                                                {formatIDR(item.amount)}
                                                            </p>
                                                            <span
                                                                className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                                                    isPaid
                                                                        ? 'bg-emerald-50 text-emerald-700'
                                                                        : 'bg-amber-50 text-amber-700'
                                                                }`}
                                                            >
                                                                {isPaid ? 'Settlement' : 'Pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                                        <span>Endpoint Notifikasi Midtrans:</span>
                                        <span className="font-mono font-semibold text-emerald-700">/api/notification</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================================== */}
                    {/* TAB 2: MANAJEMEN DONASI & MIDTRANS */}
                    {/* ==================================================================== */}
                    {activeMenu === 'donations' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Daftar Transaksi Donasi & Verifikasi Midtrans
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Otomatis membaca setiap transaksi donatur yang masuk dari Midtrans maupun input sekretariat.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowManualDonationForm(!showManualDonationForm)}
                                            className="btn-primary text-xs py-2 px-3.5"
                                        >
                                            <PlusIcon className="w-4 h-4" />
                                            <span>Catat Donasi Manual / Offline</span>
                                        </button>
                                    </div>
                                </div>

                                {showManualDonationForm && (
                                    <form
                                        onSubmit={handleSaveManualDonation}
                                        className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                Input Penerimaan Donasi Tunai / Transfer Manual
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => setShowManualDonationForm(false)}
                                                className="text-xs text-slate-500 hover:text-slate-800"
                                            >
                                                Tutup
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Nama Donatur
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={manualDonationForm.donorName}
                                                    onChange={(e) =>
                                                        setManualDonationForm({
                                                            ...manualDonationForm,
                                                            donorName: e.target.value
                                                        })
                                                    }
                                                    placeholder="Misal: H. Sulaiman / Hamba Allah"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Program Akad
                                                </label>
                                                <select
                                                    value={manualDonationForm.program}
                                                    onChange={(e) =>
                                                        setManualDonationForm({
                                                            ...manualDonationForm,
                                                            program: e.target.value
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Santunan & Pendidikan Anak Yatim">Santunan & Pendidikan Anak Yatim</option>
                                                    <option value="Pemenuhan Pangan & Gizi Asrama">Pemenuhan Pangan & Gizi Asrama</option>
                                                    <option value="Zakat Maal / Zakat Penghasilan">Zakat Maal / Zakat Penghasilan</option>
                                                    <option value="Wakaf Pemeliharaan Asrama">Wakaf Pemeliharaan Asrama</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Nominal Donasi (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="10000"
                                                    required
                                                    value={manualDonationForm.amount}
                                                    onChange={(e) =>
                                                        setManualDonationForm({
                                                            ...manualDonationForm,
                                                            amount: e.target.value
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Metode Penerimaan
                                                </label>
                                                <select
                                                    value={manualDonationForm.method}
                                                    onChange={(e) =>
                                                        setManualDonationForm({
                                                            ...manualDonationForm,
                                                            method: e.target.value
                                                        })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Tunai / Kas Sekretariat">Tunai / Kas Sekretariat</option>
                                                    <option value="Transfer Bank BSI">Transfer Bank BSI</option>
                                                    <option value="Transfer Bank BRI">Transfer Bank BRI</option>
                                                    <option value="QRIS Statis Panti">QRIS Statis Panti</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button type="submit" className="btn-primary text-xs py-2 px-4">
                                                Simpan & Terbitkan Kwitansi
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 justify-between">
                                    <div className="relative flex-1 max-w-md">
                                        <MagnifyingGlassIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Cari Order ID, nama donatur, atau program..."
                                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-primary"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {['ALL', 'PAID', 'PENDING'].map((st) => (
                                            <button
                                                key={st}
                                                type="button"
                                                onClick={() => setStatusFilter(st)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                                    statusFilter === st
                                                        ? 'bg-primary text-white border-primary'
                                                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                }`}
                                            >
                                                {st === 'ALL' ? 'Semua' : st === 'PAID' ? 'Berhasil (Lunas)' : 'Pending'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                <th className="py-3 pr-4">No. Referensi</th>
                                                <th className="py-3 px-4">Tanggal</th>
                                                <th className="py-3 px-4">Donatur</th>
                                                <th className="py-3 px-4">Program Akad</th>
                                                <th className="py-3 px-4">Nominal</th>
                                                <th className="py-3 px-4">Metode</th>
                                                <th className="py-3 px-4">Status</th>
                                                <th className="py-3 pl-4 text-right">Aksi / Kwitansi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                            {filteredDonations.map((item) => {
                                                const isPaid =
                                                    (item.status || '').toLowerCase().includes('berhasil') ||
                                                    (item.status || '').toLowerCase().includes('settlement');
                                                return (
                                                    <tr key={item.id} className="hover:bg-slate-50/80">
                                                        <td className="py-3.5 pr-4 font-mono font-semibold text-slate-800">
                                                            {item.id}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-600">{item.date}</td>
                                                        <td className="py-3.5 px-4 font-semibold text-slate-900">
                                                            {item.donorName || 'Hamba Allah'}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-700">{item.program}</td>
                                                        <td className="py-3.5 px-4 font-bold text-primary tabular-nums">
                                                            {formatIDR(item.amount)}
                                                        </td>
                                                        <td className="py-3.5 px-4 text-slate-600">{item.method}</td>
                                                        <td className="py-3.5 px-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                                    isPaid
                                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                                                                }`}
                                                            >
                                                                <span
                                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                                        isPaid ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                                                                    }`}
                                                                />
                                                                {item.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3.5 pl-4 text-right space-x-2">
                                                            {!isPaid && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleApproveDonationStatus(item.id)}
                                                                    className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                                                                >
                                                                    Verifikasi Lunas
                                                                </button>
                                                            )}
                                                            <a
                                                                href={`/success?order_id=${item.id}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                            >
                                                                <PrinterIcon className="w-4 h-4" />
                                                                <span>Kwitansi</span>
                                                            </a>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================================== */}
                    {/* TAB 3: BUKU KAS & PENGELUARAN PSAK 109 */}
                    {/* ==================================================================== */}
                    {activeMenu === 'kas' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Buku Kas Umum & Realisasi Belanja Panti (PSAK 109)
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Pencatatan mutasi kas masuk dan pengeluaran operasional harian asrama.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowKasForm(!showKasForm)}
                                        className="btn-primary text-xs py-2 px-3.5"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        <span>Catat Mutasi Kas Baru</span>
                                    </button>
                                </div>

                                {showKasForm && (
                                    <form
                                        onSubmit={handleSaveKas}
                                        className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900">
                                            Formulir Pencatatan Mutasi Kas Yayasan
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Jenis Mutasi
                                                </label>
                                                <select
                                                    value={kasForm.jenis}
                                                    onChange={(e) => setKasForm({ ...kasForm, jenis: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
                                                >
                                                    <option value="KELUAR">KAS KELUAR (Belanja / Penyaluran)</option>
                                                    <option value="MASUK">KAS MASUK (Penerimaan Non-Gateway)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Pos Akad / Kategori PSAK 109
                                                </label>
                                                <select
                                                    value={kasForm.kategori}
                                                    onChange={(e) => setKasForm({ ...kasForm, kategori: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Pangan & Gizi Asrama">Pangan & Gizi Asrama</option>
                                                    <option value="Beasiswa & Pendidikan">Beasiswa & Pendidikan</option>
                                                    <option value="Operasional & Utilitas Asrama">Operasional & Utilitas Asrama</option>
                                                    <option value="Kesehatan Santri">Kesehatan Santri</option>
                                                    <option value="Dana Infaq & Sedekah">Dana Infaq & Sedekah</option>
                                                    <option value="Dana Zakat Maal">Dana Zakat Maal</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Nominal (Rp)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1000"
                                                    required
                                                    value={kasForm.nominal}
                                                    onChange={(e) => setKasForm({ ...kasForm, nominal: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Penanggung Jawab
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={kasForm.pj}
                                                    onChange={(e) => setKasForm({ ...kasForm, pj: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Uraian Lengkap Transaksi / Keperluan
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={kasForm.uraian}
                                                onChange={(e) => setKasForm({ ...kasForm, uraian: e.target.value })}
                                                placeholder="Contoh: Pembelian 100 Kg beras & lauk pauk dapur asrama..."
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                            />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowKasForm(false)}
                                                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                                            >
                                                Batal
                                            </button>
                                            <button type="submit" className="btn-primary text-xs py-2 px-4">
                                                Simpan ke Buku Kas
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                <th className="py-3 pr-4">Kode Kas</th>
                                                <th className="py-3 px-4">Tanggal</th>
                                                <th className="py-3 px-4">Jenis</th>
                                                <th className="py-3 px-4">Kategori Pos</th>
                                                <th className="py-3 px-4">Uraian Transaksi</th>
                                                <th className="py-3 px-4">Penanggung Jawab</th>
                                                <th className="py-3 px-4 text-right">Nominal</th>
                                                <th className="py-3 pl-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                            {kasList.map((k) => (
                                                <tr key={k.id} className="hover:bg-slate-50/80">
                                                    <td className="py-3.5 pr-4 font-mono font-semibold text-slate-800">
                                                        {k.id}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600">{k.tanggal}</td>
                                                    <td className="py-3.5 px-4">
                                                        <span
                                                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                                                k.jenis === 'MASUK'
                                                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                                            }`}
                                                        >
                                                            {k.jenis}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 font-medium text-slate-800">
                                                        {k.kategori}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600">{k.uraian}</td>
                                                    <td className="py-3.5 px-4 text-slate-500">{k.pj}</td>
                                                    <td
                                                        className={`py-3.5 px-4 text-right font-bold tabular-nums ${
                                                            k.jenis === 'MASUK' ? 'text-primary' : 'text-red-600'
                                                        }`}
                                                    >
                                                        {k.jenis === 'MASUK' ? '+' : '-'}
                                                        {formatIDR(k.nominal)}
                                                    </td>
                                                    <td className="py-3.5 pl-4 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteKas(k.id)}
                                                            className="text-slate-400 hover:text-red-600 p-1"
                                                            title="Hapus"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================================== */}
                    {/* TAB 4: DATA ANAK ASUH & SANTRI */}
                    {/* ==================================================================== */}
                    {activeMenu === 'anak' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Data Induk Anak Asuh & Monitoring Pendidikan
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Mengelola profil santri mukim & non-mukim, jenjang sekolah, serta capaian tahfidz.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingAnakId(null);
                                            setShowAnakForm(!showAnakForm);
                                        }}
                                        className="btn-primary text-xs py-2 px-3.5"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        <span>Tambah Data Anak Asuh</span>
                                    </button>
                                </div>

                                {showAnakForm && (
                                    <form
                                        onSubmit={handleSaveAnak}
                                        className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
                                    >
                                        <h3 className="text-sm font-bold text-slate-900">
                                            {editingAnakId ? 'Edit Data Anak Asuh' : 'Tambah Anak Asuh Baru'}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Nama Lengkap Anak
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={anakForm.nama}
                                                    onChange={(e) => setAnakForm({ ...anakForm, nama: e.target.value })}
                                                    placeholder="Nama lengkap santri"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Jenis Kelamin
                                                </label>
                                                <select
                                                    value={anakForm.jk}
                                                    onChange={(e) => setAnakForm({ ...anakForm, jk: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Laki-laki">Laki-laki (Putra)</option>
                                                    <option value="Perempuan">Perempuan (Putri)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Usia (Tahun)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="23"
                                                    required
                                                    value={anakForm.usia}
                                                    onChange={(e) => setAnakForm({ ...anakForm, usia: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Status Kategori
                                                </label>
                                                <select
                                                    value={anakForm.kategori}
                                                    onChange={(e) => setAnakForm({ ...anakForm, kategori: e.target.value })}
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Yatim">Yatim</option>
                                                    <option value="Piatu">Piatu</option>
                                                    <option value="Yatim Piatu">Yatim Piatu</option>
                                                    <option value="Dhuafa">Dhuafa</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Jenjang Kelas
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={anakForm.jenjang}
                                                    onChange={(e) => setAnakForm({ ...anakForm, jenjang: e.target.value })}
                                                    placeholder="Misal: SMP Kelas 8"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Nama Sekolah / Madrasah
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={anakForm.sekolah}
                                                    onChange={(e) => setAnakForm({ ...anakForm, sekolah: e.target.value })}
                                                    placeholder="Misal: MTsN Candimulyo"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Capaian Tahfidz
                                                </label>
                                                <input
                                                    type="text"
                                                    value={anakForm.hafalan}
                                                    onChange={(e) => setAnakForm({ ...anakForm, hafalan: e.target.value })}
                                                    placeholder="Misal: 3 Juz"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Status Asrama
                                                </label>
                                                <select
                                                    value={anakForm.statusMukim}
                                                    onChange={(e) =>
                                                        setAnakForm({ ...anakForm, statusMukim: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Mukim Asrama">Mukim Asrama</option>
                                                    <option value="Non-Mukim (Binaan)">Non-Mukim (Binaan)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowAnakForm(false)}
                                                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                                            >
                                                Batal
                                            </button>
                                            <button type="submit" className="btn-primary text-xs py-2 px-4">
                                                Simpan Data Anak
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                                                <th className="py-3 pr-4">Nama Lengkap</th>
                                                <th className="py-3 px-4">L/P & Usia</th>
                                                <th className="py-3 px-4">Kategori</th>
                                                <th className="py-3 px-4">Pendidikan</th>
                                                <th className="py-3 px-4">Capaian Tahfidz</th>
                                                <th className="py-3 px-4">Status Mukim</th>
                                                <th className="py-3 pl-4 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                                            {anakList.map((anak) => (
                                                <tr key={anak.id} className="hover:bg-slate-50/80">
                                                    <td className="py-3.5 pr-4 font-bold text-slate-900">
                                                        {anak.nama}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600">
                                                        {anak.jk} • {anak.usia} Thn
                                                    </td>
                                                    <td className="py-3.5 px-4">
                                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-light text-primary border border-emerald-200">
                                                            {anak.kategori}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-700">
                                                        <span className="font-semibold block">{anak.jenjang}</span>
                                                        <span className="text-xs text-slate-500">{anak.sekolah}</span>
                                                    </td>
                                                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">
                                                        {anak.hafalan}
                                                    </td>
                                                    <td className="py-3.5 px-4 text-slate-600">{anak.statusMukim}</td>
                                                    <td className="py-3.5 pl-4 text-right space-x-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEditAnak(anak)}
                                                            className="text-slate-500 hover:text-primary p-1"
                                                            title="Edit"
                                                        >
                                                            <PencilSquareIcon className="w-4 h-4 inline" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteAnak(anak.id)}
                                                            className="text-slate-400 hover:text-red-600 p-1"
                                                            title="Hapus"
                                                        >
                                                            <TrashIcon className="w-4 h-4 inline" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================================== */}
                    {/* TAB 5: GALERI KEGIATAN (FULL CRUD: UPLOAD FILE GAMBAR, EDIT & HAPUS) */}
                    {/* ==================================================================== */}
                    {activeMenu === 'gallery' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-card space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Manajemen Galeri & Dokumentasi Kegiatan Panti
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Upload foto langsung dari komputer/HP Anda, edit postingan, atau hapus dokumentasi kegiatan.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingGalleryId(null);
                                            setGalleryForm({
                                                title: '',
                                                category: 'Pendidikan & Tahfidz',
                                                date: 'November 2026',
                                                description: '',
                                                image_url: ''
                                            });
                                            setShowGalleryForm(!showGalleryForm);
                                        }}
                                        className="btn-primary text-xs py-2 px-3.5"
                                    >
                                        <PlusIcon className="w-4 h-4" />
                                        <span>Tambah Postingan Galeri</span>
                                    </button>
                                </div>

                                {showGalleryForm && (
                                    <form
                                        onSubmit={handleSaveGallery}
                                        className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-bold text-slate-900">
                                                {editingGalleryId
                                                    ? 'Edit Postingan Dokumentasi Galeri'
                                                    : 'Tambah Postingan Kegiatan Baru'}
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowGalleryForm(false);
                                                    setEditingGalleryId(null);
                                                }}
                                                className="text-xs text-slate-500 hover:text-slate-800"
                                            >
                                                Tutup [X]
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Judul Kegiatan
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={galleryForm.title}
                                                    onChange={(e) =>
                                                        setGalleryForm({ ...galleryForm, title: e.target.value })
                                                    }
                                                    placeholder="Judul dokumentasi..."
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Kategori Program
                                                </label>
                                                <select
                                                    value={galleryForm.category}
                                                    onChange={(e) =>
                                                        setGalleryForm({ ...galleryForm, category: e.target.value })
                                                    }
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                >
                                                    <option value="Pendidikan & Tahfidz">Pendidikan & Tahfidz</option>
                                                    <option value="Beasiswa Sekolah">Beasiswa Sekolah</option>
                                                    <option value="Pangan & Gizi Asrama">Pangan & Gizi Asrama</option>
                                                    <option value="Keagamaan & Doa Bersama">Keagamaan & Doa Bersama</option>
                                                    <option value="Sosial Kemanusiaan">Sosial Kemanusiaan</option>
                                                    <option value="Asrama & Kemandirian">Asrama & Kemandirian</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                    Bulan / Tanggal Kegiatan
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={galleryForm.date}
                                                    onChange={(e) =>
                                                        setGalleryForm({ ...galleryForm, date: e.target.value })
                                                    }
                                                    placeholder="Misal: November 2026"
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Upload File Gambar dari Komputer + Preview */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Upload File Gambar (JPG / PNG / WEBP)
                                                </label>
                                                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 rounded-xl bg-white hover:border-primary cursor-pointer transition-colors">
                                                    <ArrowUpTrayIcon className="w-6 h-6 text-primary mb-1" />
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        Klik untuk Pilih Foto dari Perangkat Anda
                                                    </span>
                                                    <span className="text-[11px] text-slate-400">
                                                        Atau tempel URL gambar di kolom sebelah kanan
                                                    </span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleImageFileUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="block text-xs font-semibold text-slate-700">
                                                    Atau URL Gambar & Pratinjau Foto
                                                </label>
                                                <input
                                                    type="text"
                                                    value={galleryForm.image_url}
                                                    onChange={(e) =>
                                                        setGalleryForm({ ...galleryForm, image_url: e.target.value })
                                                    }
                                                    placeholder="https://images.unsplash.com/..."
                                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                                />
                                                {galleryForm.image_url && (
                                                    <div className="relative h-28 w-48 rounded-lg overflow-hidden border border-slate-200 bg-white">
                                                        <img
                                                            src={galleryForm.image_url}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                                Keterangan / Deskripsi Kegiatan
                                            </label>
                                            <textarea
                                                rows="3"
                                                required
                                                value={galleryForm.description}
                                                onChange={(e) =>
                                                    setGalleryForm({ ...galleryForm, description: e.target.value })
                                                }
                                                placeholder="Jelaskan secara singkat pelaksanaan kegiatan..."
                                                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs"
                                            />
                                        </div>

                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowGalleryForm(false);
                                                    setEditingGalleryId(null);
                                                }}
                                                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600"
                                            >
                                                Batal
                                            </button>
                                            <button type="submit" className="btn-primary text-xs py-2 px-4">
                                                {editingGalleryId ? 'Simpan Perubahan Postingan' : 'Publikasikan ke Galeri'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {galleryList.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-slate-200 overflow-hidden bg-white flex flex-col justify-between shadow-xs"
                                        >
                                            <div>
                                                <div className="h-44 bg-slate-100 relative overflow-hidden">
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold">
                                                        {item.category}
                                                    </span>
                                                </div>
                                                <div className="p-4">
                                                    <span className="text-[11px] text-slate-400 font-medium">
                                                        {item.date}
                                                    </span>
                                                    <h3 className="text-sm font-bold text-slate-900 mt-0.5 line-clamp-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditGallery(item)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                                                >
                                                    <PencilSquareIcon className="w-4 h-4" />
                                                    <span>Edit Postingan</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGallery(item.id)}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                    <span>Hapus</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ==================================================================== */}
                    {/* TAB 6: LAPORAN LPJ & EXPORT */}
                    {/* ==================================================================== */}
                    {activeMenu === 'laporan' && (
                        <div className="space-y-6">
                            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-card space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
                                    <div className="flex items-center gap-3.5">
                                        <img
                                            src={`${import.meta.env.BASE_URL}img/logo.png`}
                                            alt="Logo"
                                            className="w-12 h-12 object-contain"
                                        />
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-primary block">
                                                Laporan Pertanggungjawaban Publik (PSAK 109)
                                            </span>
                                            <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900">
                                                Yayasan Assholihin Candimulyo Jombang
                                            </h2>
                                            <p className="text-xs text-slate-500">
                                                LKSA Panti Asuhan As-Sholihin • Rekapitulasi Kas & Donasi Terverifikasi
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2 print:hidden">
                                        <button
                                            type="button"
                                            onClick={handleExportCSV}
                                            className="btn-secondary text-xs py-2 px-3.5"
                                        >
                                            <ArrowDownTrayIcon className="w-4 h-4" />
                                            <span>Unduh CSV / Excel</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="btn-primary text-xs py-2 px-3.5"
                                        >
                                            <PrinterIcon className="w-4 h-4" />
                                            <span>Cetak LPJ Resmi (PDF)</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                                        <span className="text-xs text-emerald-800 font-semibold block">
                                            Total Penerimaan Dana (Infaq, Zakat, Donasi)
                                        </span>
                                        <strong className="text-lg sm:text-xl font-bold text-primary tabular-nums mt-1 block">
                                            {formatIDR(basePemasukan)}
                                        </strong>
                                    </div>
                                    <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                                        <span className="text-xs text-amber-900 font-semibold block">
                                            Total Realisasi Penyaluran & Operasional
                                        </span>
                                        <strong className="text-lg sm:text-xl font-bold text-amber-800 tabular-nums mt-1 block">
                                            {formatIDR(basePengeluaran)}
                                        </strong>
                                    </div>
                                    <div className="p-4 rounded-xl bg-slate-900 text-white">
                                        <span className="text-xs text-slate-300 font-semibold block">
                                            Saldo Akhir Kas Yayasan Terverifikasi
                                        </span>
                                        <strong className="text-lg sm:text-xl font-bold text-emerald-400 tabular-nums mt-1 block">
                                            {formatIDR(saldoAkhir)}
                                        </strong>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 mb-3">
                                        Rincian Mutasi Kas & Donasi Terbaru
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                                            <thead className="bg-slate-50">
                                                <tr className="border-b border-slate-200 font-bold text-slate-600">
                                                    <th className="p-3 border-r border-slate-200">No. Referensi</th>
                                                    <th className="p-3 border-r border-slate-200">Tanggal</th>
                                                    <th className="p-3 border-r border-slate-200">Kategori / Akad</th>
                                                    <th className="p-3 border-r border-slate-200">Uraian / Donatur</th>
                                                    <th className="p-3 text-right">Nominal</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-200">
                                                {kasList.map((k) => (
                                                    <tr key={k.id}>
                                                        <td className="p-3 border-r border-slate-200 font-mono">{k.id}</td>
                                                        <td className="p-3 border-r border-slate-200">{k.tanggal}</td>
                                                        <td className="p-3 border-r border-slate-200 font-semibold">
                                                            [{k.jenis}] {k.kategori}
                                                        </td>
                                                        <td className="p-3 border-r border-slate-200">{k.uraian}</td>
                                                        <td
                                                            className={`p-3 text-right font-bold tabular-nums ${
                                                                k.jenis === 'MASUK' ? 'text-primary' : 'text-red-600'
                                                            }`}
                                                        >
                                                            {k.jenis === 'MASUK' ? '+' : '-'}
                                                            {formatIDR(k.nominal)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
