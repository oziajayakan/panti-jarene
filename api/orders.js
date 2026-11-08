import { setCorsHeaders } from './_lib/db.js';
import { ordersStore, getMidtransAuthHeader, API_URL } from './_lib/ordersStore.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const authHeader = getMidtransAuthHeader();
    const list = [...ordersStore.values()];

    // Sinkronkan status setiap order yang masih pending ke Midtrans v2 API
    await Promise.all(
        list.map(async (ord) => {
            if (ord.status === 'paid' || !ord.order_id || ord.order_id.startsWith('ORD-')) return;
            try {
                const r = await fetch(`${API_URL}/${encodeURIComponent(ord.order_id)}/status`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                });
                const midtransStatus = await r.json();
                if (midtransStatus && midtransStatus.transaction_status) {
                    const txStatus = midtransStatus.transaction_status;
                    if (txStatus === 'settlement' || txStatus === 'capture') {
                        ord.status = 'paid';
                    } else if (txStatus === 'pending') {
                        ord.status = 'pending';
                    } else if (['deny', 'cancel', 'expire', 'failure'].includes(txStatus)) {
                        ord.status = txStatus === 'expire' ? 'expired' : 'failed';
                    }
                    if (midtransStatus.payment_type) {
                        ord.payment_channel = midtransStatus.payment_type.replace(/_/g, ' ').toUpperCase();
                    }
                    if (midtransStatus.gross_amount) {
                        ord.amount = parseFloat(midtransStatus.gross_amount);
                    }
                    ordersStore.set(ord.order_id, ord);
                }
            } catch {}
        })
    );

    return res.status(200).json([...ordersStore.values()].reverse());
}
