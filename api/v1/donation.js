import { setCorsHeaders } from '../_lib/db.js';
import { ordersStore, notificationsStore, getMidtransAuthHeader, SNAP_URL } from '../_lib/ordersStore.js';

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const donorName = body.donor_name || body.nama || 'Hamba Allah';
        const donorEmail = body.donor_email || body.email || 'donatur@assholihin.or.id';
        const phone = body.no_wa || '';
        const program = body.program || 'Santunan & Pendidikan Anak Yatim';
        const grossAmount = Math.max(10000, parseInt(body.amount || body.nominal || 50000, 10));
        const orderId = 'DONASI-' + Date.now();

        const authHeader = getMidtransAuthHeader();

        const payload = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount
            },
            item_details: [
                {
                    id: 'donasi-panti',
                    price: grossAmount,
                    quantity: 1,
                    name: String(program).substring(0, 50)
                }
            ],
            customer_details: {
                first_name: donorName,
                email: donorEmail,
                phone: phone
            },
            expiry: {
                unit: 'minutes',
                duration: 15
            }
        };

        const response = await fetch(SNAP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': authHeader
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                status: 'error',
                message: (data.error_messages && data.error_messages.join(', ')) || 'Gagal membuat transaksi Midtrans',
                details: data
            });
        }

        const nowIso = new Date().toISOString();
        const expiresAtIso = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        const orderRecord = {
            order_id: orderId,
            customer_name: donorName,
            customer_email: donorEmail,
            customer_phone: phone,
            program: program,
            amount: grossAmount,
            status: 'pending',
            payment_url: data.redirect_url,
            token: data.token,
            payment_channel: 'MIDTRANS SNAP',
            created_at: nowIso,
            expires_at: expiresAtIso
        };

        ordersStore.set(orderId, orderRecord);

        notificationsStore.unshift({
            id: `NOTIF-${Date.now()}`,
            order_id: orderId,
            title: `Donasi Baru Dibuat: ${donorName}`,
            message: `${donorName} memulai donasi Rp ${grossAmount.toLocaleString('id-ID')} (${program})`,
            status: 'pending',
            amount: grossAmount,
            donor_name: donorName,
            time: new Date().toISOString(),
            read: false
        });

        return res.status(200).json({
            status: 'success',
            success: true,
            token: data.token,
            payment_url: data.redirect_url,
            invoice_number: orderId,
            expires_at: expiresAtIso,
            data: {
                token: data.token,
                payment_url: data.redirect_url,
                order_id: orderId,
                expires_at: expiresAtIso
            }
        });
    } catch (error) {
        console.error('Midtrans Error:', error);
        return res.status(500).json({
            status: 'error',
            message: error.message || 'Terjadi kesalahan pada server pembayaran'
        });
    }
}
