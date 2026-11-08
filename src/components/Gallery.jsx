import { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryModal from './GalleryModal';

const FALLBACK_GALLERY = [
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

export default function Gallery() {
    const [gallery, setGallery] = useState(FALLBACK_GALLERY);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const adminGalleryRaw = localStorage.getItem('assholihin_admin_gallery');
                if (adminGalleryRaw) {
                    const parsed = JSON.parse(adminGalleryRaw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        setGallery(parsed);
                        return;
                    }
                }
            } catch {}

            try {
                const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
                const response = await axios.get(`${baseUrl}/landing/gallery`);
                if (Array.isArray(response.data) && response.data.length > 0) {
                    const uniqueImages = new Set(response.data.map((i) => i.image_url));
                    if (uniqueImages.size > 1) {
                        setGallery(response.data);
                    }
                }
            } catch {
                // Tetap gunakan FALLBACK_GALLERY yang memiliki 6 dokumentasi unik
            }
        };

        fetchGallery();
        window.addEventListener('assholihin-data-updated', fetchGallery);
        return () => window.removeEventListener('assholihin-data-updated', fetchGallery);
    }, []);

    const categories = [
        'Semua',
        'Pendidikan & Tahfidz',
        'Beasiswa Sekolah',
        'Pangan & Gizi Asrama',
        'Keagamaan & Doa Bersama',
        'Sosial Kemanusiaan'
    ];

    const filteredGallery =
        selectedCategory === 'Semua'
            ? gallery
            : gallery.filter((item) => item.category === selectedCategory);

    return (
        <section id="gallery" className="py-16 lg:py-24 bg-surface border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
                    <div className="max-w-2xl">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                            Berita & Galeri Kegiatan Asrama
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 mt-1">
                            Dokumentasi Penyaluran & Aktivitas Santri
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                            Rekam jejak nyata penyaluran amanah donatur dalam kegiatan pendidikan, pemenuhan gizi, dan pembinaan karakter anak asuh Panti Asuhan As-Sholihin.
                        </p>
                    </div>
                </div>

                {/* Filter Kategori ala PondokYatim.or.id */}
                <div className="flex flex-wrap items-center gap-2 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                                selectedCategory === cat
                                    ? 'bg-primary text-white shadow-2xs'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary/40 hover:text-slate-900'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredGallery.slice(0, 6).map((item) => (
                        <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="card-surface overflow-hidden group cursor-pointer flex flex-col justify-between bg-white hover:border-primary/40 hover:shadow-card-hover transition-all"
                        >
                            <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                <img
                                    src={item.image_url}
                                    alt={item.title}
                                    onError={(e) => {
                                        e.currentTarget.src = `${import.meta.env.BASE_URL}img/hero-bg.jpg`;
                                    }}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {item.category && (
                                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold">
                                        {item.category}
                                    </span>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-between">
                                <div>
                                    {item.date && (
                                        <span className="text-[11px] font-medium text-slate-400 block mb-1">
                                            {item.date} • Asrama Candimulyo Jombang
                                        </span>
                                    )}
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                <span className="text-xs font-semibold text-primary mt-4 inline-block">
                                    Lihat Detail Dokumentasi →
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <GalleryModal
                    isOpen={!!selectedItem}
                    onClose={() => setSelectedItem(null)}
                    item={selectedItem}
                />
            </div>
        </section>
    );
}
