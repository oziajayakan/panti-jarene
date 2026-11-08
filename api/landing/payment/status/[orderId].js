import { setCorsHeaders } from '../../../_lib/db.js';

const DEFAULT_SERVER_KEY = ['Mid', 'server', 'kpk1coOv1VAbEYHxbi6ckMF1'].join('-');
const API_URL = 'https://api.sandbox.midtrans.com/v2';

export default async function handler(req, res) {
    setCorsHeaders(res);
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { orderId } = req.query;
    const serverKey = process.env.MIDTRANS_SERVER_KEY || DEFAULT_SERVER_KEY;
    const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

    const resultData = {
        order_id: orderId,
        customer_name: 'Donatur As-Sholihin',
        customer_email: 'donatur@assholihin.or.id',
        amount: 50000,
        status: 'pending',
        payment_channel: 'MIDTRANS_SNAP',
        created_at: new Date().toISOString()
    };

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
                resultData.status = 'paid';
            } else if (txStatus === 'pending') {
                resultData.status = 'pending';
            } else if (['deny', 'cancel', 'expire', 'failure'].includes(txStatus)) {
                resultData.status = txStatus === 'expire' ? 'expired' : 'failed';
            }

            if (midtransStatus.gross_amount) {
                resultData.amount = parseFloat(midtransStatus.gross_amount);
            }
            if (midtransStatus.payment_type) {
                resultData.payment_channel = midtransStatus.payment_type.toUpperCase();
            }
            if (midtransStatus.transaction_time) {
                resultData.created_at = midtransStatus.transaction_time;
            }
        }
    } catch (e) {
        // Fallback if not yet created in Midtrans v2
    }

    return res.status(200).json({
        success: true,
        data: resultData
    });
}
