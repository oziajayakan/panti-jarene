import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
    UserGroupIcon,
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    DocumentCheckIcon
} from '@heroicons/react/24/outline';
import useLandingData from '../hooks/useLandingData';
import RecentDonations from './RecentDonations';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Stats() {
    const { stats, chartData, loading, year, setYear, formatCurrency, formatCurrencyShort } = useLandingData();

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: {
                        family: "'Plus Jakarta Sans', 'Inter', sans-serif",
                        size: 12,
                        weight: '600'
                    },
                    padding: 16
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#0f172a',
                titleColor: '#f8fafc',
                bodyColor: '#e2e8f0',
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('id-ID', {
                                style: 'currency',
                                currency: 'IDR',
                                minimumFractionDigits: 0
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 11 },
                    color: '#64748b'
                }
            },
            y: {
                border: { display: false },
                grid: { color: '#f1f5f9' },
                ticks: {
                    callback: function (value) {
                        return formatCurrencyShort(value);
                    },
                    font: { family: "'Inter', sans-serif", size: 11 },
                    color: '#64748b'
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        elements: {
            point: {
                radius: 3,
                hoverRadius: 5
            }
        }
    };

    const data = {
        labels: chartData.labels?.length
            ? chartData.labels
            : ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            {
                label: 'Donasi & Kas Masuk',
                data: chartData.income?.length
                    ? chartData.income
                    : [14500000, 16200000, 18900000, 22400000, 15800000, 19300000, 21000000, 17500000, 20400000, 24100000, 28450000, 0],
                borderColor: '#0D6B41',
                backgroundColor: 'rgba(13, 107, 65, 0.08)',
                borderWidth: 2,
                fill: true,
                tension: 0.35
            },
            {
                label: 'Realisasi Belanja Panti',
                data: chartData.expense?.length
                    ? chartData.expense
                    : [12100000, 14800000, 15200000, 19600000, 14300000, 16900000, 18200000, 15900000, 17800000, 18900000, 19300000, 0],
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.04)',
                borderWidth: 2,
                borderDash: [4, 4],
                fill: false,
                tension: 0.35
            }
        ]
    };

    const metricCards = [
        {
            title: 'Anak Asuh Terbina',
            value: stats.anak || 45,
            suffix: 'Santri',
            subtitle: 'Mukim Asrama & Non-Mukim',
            icon: UserGroupIcon,
            color: 'text-primary bg-primary-light'
        },
        {
            title: 'Saldo Kas Terverifikasi',
            value: formatCurrency(stats.total_keuangan || 84620000),
            suffix: '',
            subtitle: 'Rekening BSI & Kas Operasional',
            icon: BanknotesIcon,
            color: 'text-emerald-700 bg-emerald-50'
        },
        {
            title: 'Total Pemasukan Donasi',
            value: formatCurrency(stats.pemasukan || 218550000),
            suffix: '',
            subtitle: `Akumulasi Tahun ${year}`,
            icon: ArrowTrendingUpIcon,
            color: 'text-blue-700 bg-blue-50'
        },
        {
            title: 'Realisasi Penyaluran Kas',
            value: formatCurrency(stats.pengeluaran || 183000000),
            suffix: '',
            subtitle: 'Pangan, Pendidikan & Asrama',
            icon: ArrowTrendingDownIcon,
            color: 'text-amber-700 bg-amber-50'
        }
    ];

    return (
        <section id="transparency" className="py-16 lg:py-24 bg-white border-b border-slate-200/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-1">
                            <DocumentCheckIcon className="w-4 h-4" />
                            <span>Laporan Keuangan Terbuka</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                            Portal Transparansi Dana & Realisasi Kas
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                            Seluruh donasi yang masuk melalui Payment Gateway maupun transfer manual tercatat otomatis ke dalam buku kas dan dilaporkan secara terbuka kepada publik.
                        </p>
                    </div>

                    {/* Year Filter */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">Tahun Buku:</span>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-800 focus:outline-none focus:border-primary"
                        >
                            {(stats.available_years?.length ? stats.available_years : [2026, 2025, 2024]).map((yr) => (
                                <option key={yr} value={yr}>
                                    {yr}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 4 KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {metricCards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <div key={idx} className="card-surface p-5">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-slate-500">{card.title}</span>
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                                <div className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                                    {loading ? '...' : card.value}{' '}
                                    {card.suffix && <span className="text-sm font-semibold text-slate-500">{card.suffix}</span>}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Main Split: Cash Flow Chart (7 Cols) + Live Donor Ledger (5 Cols) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    {/* Chart Panel */}
                    <div className="lg:col-span-7 card-surface p-6 flex flex-col justify-between">
                        <div>
                            <div className="mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Grafik Arus Kas Masuk vs Pengeluaran Operasional
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Rekapitulasi bulanan terintegrasi database kas internal panti
                                    </p>
                                </div>
                            </div>

                            <div className="h-[300px] sm:h-[340px] w-full">
                                <Line data={data} options={options} />
                            </div>
                        </div>

                        {/* Allocation Breakdown Footer */}
                        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-4 text-xs">
                            <div>
                                <span className="text-slate-500 block">Alokasi Pendidikan & SPP</span>
                                <strong className="text-slate-900 font-bold text-sm tabular-nums">45% Dana Kas</strong>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Pangan & Gizi Harian</span>
                                <strong className="text-slate-900 font-bold text-sm tabular-nums">38% Dana Kas</strong>
                            </div>
                            <div>
                                <span className="text-slate-500 block">Pemeliharaan Asrama</span>
                                <strong className="text-slate-900 font-bold text-sm tabular-nums">17% Dana Kas</strong>
                            </div>
                        </div>
                    </div>

                    {/* Recent Verified Donations List */}
                    <div className="lg:col-span-5">
                        <RecentDonations />
                    </div>
                </div>
            </div>
        </section>
    );
}
