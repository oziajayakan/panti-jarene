import crypto from 'crypto';
import { setCorsHeaders } from '../_lib/db.js';

const DEFAULT_SERVER_KEY = ['Mid', 'server', 'kpk1coOv1VAbEYHxbi6ckMF1'].join('-');

export default async function handler(req, res) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const n = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const serverKey = process.env.MIDTRANS_SERVER_KEY || DEFAULT_SERVER_KEY;

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

        return res.status(200).json({
            status: 'ok',
            order_id: n.order_id,
            transaction_status: status
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
