import { query, setCorsHeaders } from '../_lib/db.js';

export default async function handler(req, res) {
    // Handle CORS
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get current year from query or default to current year
        const currentYear = req.query.year || new Date().getFullYear();

        // 1. Count Anak
        const anakResult = await query('SELECT COUNT(*) as count FROM anak');
        const anakCount = anakResult[0].count;

        // 2. Count Pengurus (Users)
        const pengurusResult = await query('SELECT COUNT(*) as count FROM users');
        const pengurusCount = pengurusResult[0].count;

        // 3. Monthly stats (Income vs Expense per month)
        const monthlyStats = await query(`
            SELECT 
                MONTH(tanggal) as month,
                SUM(CASE WHEN LOWER(jenis_transaksi) = 'masuk' THEN nominal ELSE 0 END) as total_masuk,
                SUM(CASE WHEN LOWER(jenis_transaksi) = 'keluar' THEN nominal ELSE 0 END) as total_keluar
            FROM transaksi_kas
            WHERE YEAR(tanggal) = ?
            GROUP BY MONTH(tanggal)
            ORDER BY month
        `, [currentYear]);

        // 4. Get available years
        const yearsResult = await query(`
            SELECT DISTINCT YEAR(tanggal) as year 
            FROM transaksi_kas 
            ORDER BY year DESC
        `);
        const availableYears = yearsResult.map(row => row.year);

        // 5. Calculate totals
        // Total Balance (cumulative up to selected year)
        const balanceResult = await query(`
            SELECT 
                (SELECT COALESCE(SUM(nominal), 0) FROM transaksi_kas 
                 WHERE LOWER(jenis_transaksi) = 'masuk' AND YEAR(tanggal) <= ?) as total_in,
                (SELECT COALESCE(SUM(nominal), 0) FROM transaksi_kas 
                 WHERE LOWER(jenis_transaksi) = 'keluar' AND YEAR(tanggal) <= ?) as total_out
        `, [currentYear, currentYear]);
        const totalBalance = balanceResult[0].total_in - balanceResult[0].total_out;

        // Total Income for selected year
        const incomeResult = await query(`
            SELECT COALESCE(SUM(nominal), 0) as total
            FROM transaksi_kas 
            WHERE LOWER(jenis_transaksi) = 'masuk' AND YEAR(tanggal) = ?
        `, [currentYear]);
        const totalIncome = incomeResult[0].total;

        // Total Expense for selected year
        const expenseResult = await query(`
            SELECT COALESCE(SUM(nominal), 0) as total
            FROM transaksi_kas 
            WHERE LOWER(jenis_transaksi) = 'keluar' AND YEAR(tanggal) = ?
        `, [currentYear]);
        const totalExpense = expenseResult[0].total;

        // 6. Format for Chart.js
        const indonesianMonths = [
            'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];

        const labels = [];
        const incomeData = [];
        const expenseData = [];

        for (let i = 1; i <= 12; i++) {
            labels.push(indonesianMonths[i - 1]);

            const stat = monthlyStats.find(s => s.month === i);
            incomeData.push(stat ? parseInt(stat.total_masuk) : 0);
            expenseData.push(stat ? parseInt(stat.total_keluar) : 0);
        }

        // Return response
        return res.status(200).json({
            counts: {
                anak: anakCount,
                pengurus: pengurusCount,
                total_keuangan: totalBalance,
                pengeluaran: totalExpense,
                pemasukan: totalIncome,
                year: parseInt(currentYear),
                available_years: availableYears.length > 0 ? availableYears : [new Date().getFullYear()]
            },
            chart: {
                labels,
                income: incomeData,
                expense: expenseData
            }
        });

    } catch (error) {
        console.error('Error fetching stats:', error);
        return res.status(500).json({
            error: 'Server Error',
            message: error.message
        });
    }
}
