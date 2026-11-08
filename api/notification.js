import crypto from 'crypto';
import { setCorsHeaders } from './_lib/db.js';
import { ordersStore, notificationsStore, getMidtransServerKey } from './_lib/ordersStore.js';

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json(notificationsStore.slice(0, 30));
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const n = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const serverKey = getMidtransServerKey();

        if (n.signature_key) {
            const expected = crypto
                .createHash('sha512')
                .update((n.order_id || '') + (n.status_code || '') + (n.gross_amount || '') + serverKey)
                .digest('hex');

            if (expected !== n.signature_key) {
                return res.status(403).json({ error: 'Signature tidak valid' });
            }
        }

        let status = n.transaction_status;
        if (status === 'capture') {
            status = n.fraud_status === 'accept' ? 'paid' : 'pending';
        } else if (status === 'settlement') {
            status = 'paid';
        } else if (['deny', 'cancel', 'expire', 'failure'].includes(status)) {
            status = status === 'expire' ? 'expired' : 'failed';
        }

        const existing = ordersStore.get(n.order_id) || {
            order_id: n.order_id,
            customer_name: 'Donatur As-Sholihin',
            customer_email: 'donatur@assholihin.or.id',
            program: 'Santunan & Pendidikan Anak Yatim',
            amount: parseFloat(n.gross_amount || 50000),
            created_at: n.transaction_time || new Date().toISOString()
        };

        existing.status = status;
        if (n.payment_type) {
            existing.payment_channel = n.payment_type.replace(/_/g, ' ').toUpperCase();
        }
        if (n.gross_amount) {
            existing.amount = parseFloat(n.gross_amount);
        }

        ordersStore.set(n.order_id, existing);

        notificationsStore.unshift({
            id: `NOTIF-${Date.now()}`,
            order_id: n.order_id,
            title: status === 'paid' ? `Pembayaran Lunas: ${existing.customer_name}` : `Update Status: ${n.order_id}`,
            message: `${existing.customer_name} — Rp ${Number(existing.amount).toLocaleString('id-ID')} via ${existing.payment_channel || 'Midtrans'} (${status === 'paid' ? 'Berhasil / Settlement' : status})`,
            status: status,
            amount: existing.amount,
            donor_name: existing.customer_name,
            time: new Date().toISOString(),
            read: false
        });

        return res.status(200).json({
            status: 'ok',
            order_id: n.order_id,
            transaction_status: status
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
