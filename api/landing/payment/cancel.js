import { setCorsHeaders } from '../../../_lib/db.js';
import { ordersStore, getMidtransAuthHeader, API_URL } from '../../../_lib/ordersStore.js';

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const orderId = body.order_id;

        if (orderId) {
            const authHeader = getMidtransAuthHeader();
            try {
                await fetch(`${API_URL}/${encodeURIComponent(orderId)}/cancel`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': authHeader
                    }
                });
            } catch {}

            if (ordersStore.has(orderId)) {
                const ord = ordersStore.get(orderId);
                ord.status = 'cancelled';
                ordersStore.set(orderId, ord);
            } else {
                ordersStore.set(orderId, {
                    order_id: orderId,
                    status: 'cancelled',
                    created_at: new Date().toISOString()
                });
            }
        }

        return res.status(200).json({ success: true, order_id: orderId, status: 'cancelled' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}
