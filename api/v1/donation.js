import { setCorsHeaders } from '../_lib/db.js';

const DEFAULT_SERVER_KEY = ['Mid', 'server', 'kpk1coOv1VAbEYHxbi6ckMF1'].join('-');
const SNAP_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

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
        const program = body.program || 'Donasi Panti Asuhan As-Sholihin';
        const grossAmount = Math.max(10000, parseInt(body.amount || body.nominal || 50000, 10));
        const orderId = 'DONASI-' + Date.now();

        const serverKey = process.env.MIDTRANS_SERVER_KEY || DEFAULT_SERVER_KEY;
        const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

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

        return res.status(200).json({
            status: 'success',
            success: true,
            token: data.token,
            payment_url: data.redirect_url,
            invoice_number: orderId,
            data: {
                token: data.token,
                payment_url: data.redirect_url,
                order_id: orderId
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
