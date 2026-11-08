import { setCorsHeaders } from '../../../_lib/db.js';
import { ordersStore, notificationsStore, getMidtransAuthHeader, API_URL } from '../../../_lib/ordersStore.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { orderId } = req.query;
    const authHeader = getMidtransAuthHeader();

    const existing = ordersStore.get(orderId) || {
        order_id: orderId,
        customer_name: 'Donatur As-Sholihin',
        customer_email: 'donatur@assholihin.or.id',
        program: 'Santunan & Pendidikan Anak Yatim',
        amount: 50000,
        status: 'pending',
        payment_channel: 'MIDTRANS SNAP',
        created_at: new Date().toISOString()
    };

    const prevStatus = existing.status;

    try {
        const response = await fetch(`${API_URL}/${encodeURIComponent(orderId)}/status`, {
            headers: {
                'Accept': 'application/json',
                'Authorization': authHeader
            }
        });
        const midtransStatus = await response.json();

        if (midtransStatus && midtransStatus.transaction_status) {
            const txStatus = midtransStatus.transaction_status;
            if (txStatus === 'settlement' || txStatus === 'capture') {
                existing.status = 'paid';
            } else if (txStatus === 'pending') {
                existing.status = 'pending';
            } else if (['deny', 'cancel', 'expire', 'failure'].includes(txStatus)) {
                existing.status = txStatus === 'expire' ? 'expired' : 'failed';
            }

            if (midtransStatus.gross_amount) {
                existing.amount = parseFloat(midtransStatus.gross_amount);
            }
            if (midtransStatus.payment_type) {
                existing.payment_channel = midtransStatus.payment_type.replace(/_/g, ' ').toUpperCase();
            }
            if (midtransStatus.transaction_time) {
                existing.created_at = midtransStatus.transaction_time;
            }
            ordersStore.set(orderId, existing);

            if (prevStatus !== 'paid' && existing.status === 'paid') {
                notificationsStore.unshift({
                    id: `NOTIF-${Date.now()}`,
                    order_id: orderId,
                    title: `Pembayaran Lunas: ${existing.customer_name}`,
                    message: `${existing.customer_name} melunasi donasi Rp ${Number(existing.amount).toLocaleString('id-ID')} via ${existing.payment_channel}`,
                    status: 'paid',
                    amount: existing.amount,
                    donor_name: existing.customer_name,
                    time: new Date().toISOString(),
                    read: false
                });
            }
        }
    } catch {}

    return res.status(200).json({
        success: true,
        data: existing
    });
}
