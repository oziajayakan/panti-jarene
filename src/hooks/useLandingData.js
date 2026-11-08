import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useLandingData() {
    const [stats, setStats] = useState({
        anak: 0,
        pengurus: 0,
        total_keuangan: 0,
        pemasukan: 0,
        pengeluaran: 0,
        year: new Date().getFullYear(),
        available_years: []
    });
    const [chartData, setChartData] = useState({
        labels: [],
        income: [],
        expense: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Use environment variable for API URL
                const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
                const response = await axios.get(`${baseUrl}/landing/stats?year=${year}`);

                // API returns direct object: { counts: {...}, chart: {...} }
                // There is no 'success' key in the current Controller response
                if (response.data.counts) {
                    setStats(response.data.counts);
                    setChartData(response.data.chart);
                    // Also update year if returned from server
                    if (response.data.counts.year) {
                        setYear(response.data.counts.year);
                    }
                }
            } catch (err) {
                console.error("Error fetching landing data:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [year]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatCurrencyShort = (value) => {
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(1) + 'M';
        }
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'jt';
        }
        return formatCurrency(value);
    };

    return { stats, chartData, loading, error, year, setYear, formatCurrency, formatCurrencyShort };
}
