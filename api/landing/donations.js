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
        // Get recent donations with donatur info
        const donations = await query(`
            SELECT 
                d.id_donasi as id,
                d.jumlah as amount,
                d.created_at as time,
                COALESCE(dn.nama, d.sumber_non_donatur, 'Hamba Allah') as name,
                COALESCE(dn.deskripsi, 'Semoga berkah...') as message
            FROM donasi d
            LEFT JOIN donatur dn ON d.id_donatur = dn.id_donatur
            ORDER BY d.tanggal_catat DESC
        `);

        // Format response
        const formattedDonations = donations.map(donation => {
            // Calculate time diff (simple version)
            const donationTime = new Date(donation.time);
            const now = new Date();
            const diffMs = now - donationTime;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            let timeAgo;
            if (diffMins < 60) {
                timeAgo = diffMins <= 1 ? 'Baru saja' : `${diffMins} menit yang lalu`;
            } else if (diffHours < 24) {
                timeAgo = `${diffHours} jam yang lalu`;
            } else if (diffDays < 30) {
                timeAgo = `${diffDays} hari yang lalu`;
            } else {
                const diffMonths = Math.floor(diffDays / 30);
                timeAgo = `${diffMonths} bulan yang lalu`;
            }

            return {
                id: donation.id,
                name: donation.name,
                amount: parseFloat(donation.amount),
                time: timeAgo,
                message: donation.message,
                initial: donation.name.substring(0, 1).toUpperCase()
            };
        });

        return res.status(200).json(formattedDonations);

    } catch (error) {
        console.error('Error fetching donations:', error);
        return res.status(500).json({
            error: 'Server Error',
            message: error.message
        });
    }
}
