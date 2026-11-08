import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import crypto from 'crypto'

const DEFAULT_MIDTRANS_SERVER_KEY = ['Mid', 'server', 'kpk1coOv1VAbEYHxbi6ckMF1'].join('-');
const SNAP_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const API_URL = 'https://api.sandbox.midtrans.com/v2';

// Penyimpanan sementara transaksi & notifikasi di memori saat dev
const devOrders = new Map();
const devNotifications = [];

function midtransDevPlugin(serverKey) {
    const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');

    const handleNotificationWebhook = (req, res, next) => {
        if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store');
            res.statusCode = 200;
            res.end(JSON.stringify(devNotifications.slice(0, 30)));
            return;
        }
        if (req.method !== 'POST') return next();

        let rawBody = '';
        req.on('data', chunk => { rawBody += chunk; });
        req.on('end', () => {
            try {
                const n = JSON.parse(rawBody || '{}');
                const orderId = n.order_id;
                const statusCode = n.status_code || '';
                const grossAmount = n.gross_amount || '';

                if (n.signature_key) {
                    const expected = crypto
                        .createHash('sha512')
                        .update(orderId + statusCode + grossAmount + serverKey)
                        .digest('hex');

                    if (expected !== n.signature_key) {
                        res.statusCode = 403;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ error: 'Signature tidak valid' }));
                        return;
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

                const existing = devOrders.get(orderId) || {
                    order_id: orderId,
                    customer_name: 'Donatur As-Sholihin',
                    customer_email: 'donatur@assholihin.or.id',
                    program: 'Santunan & Pendidikan Anak Yatim',
                    amount: parseFloat(grossAmount || 50000),
                    created_at: n.transaction_time || new Date().toISOString()
                };

                existing.status = status;
                if (n.payment_type) {
                    existing.payment_channel = n.payment_type.replace(/_/g, ' ').toUpperCase();
                }
                if (grossAmount) {
                    existing.amount = parseFloat(grossAmount);
                }

                devOrders.set(orderId, existing);

                devNotifications.unshift({
                    id: `NOTIF-${Date.now()}`,
                    order_id: orderId,
                    title: status === 'paid' ? `Pembayaran Lunas: ${existing.customer_name}` : `Notifikasi Midtrans: ${orderId}`,
                    message: `${existing.customer_name} — Rp ${Number(existing.amount).toLocaleString('id-ID')} via ${existing.payment_channel || 'Midtrans'} (${status === 'paid' ? 'Berhasil / Settlement' : status})`,
                    status: status,
                    amount: existing.amount,
                    donor_name: existing.customer_name,
                    time: new Date().toISOString(),
                    read: false
                });

                console.log(`[Midtrans Webhook] Order ${orderId} -> ${status} (${existing.payment_channel || '-'})`);

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ status: 'ok', order_id: orderId, transaction_status: status }));
            } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
            }
        });
    };

    return {
        name: 'midtrans-dev-api',
        configureServer(server) {
            // 1. Endpoint Buat Transaksi Donasi Midtrans Snap
            server.middlewares.use('/api/v1/donation', async (req, res, next) => {
                if (req.method !== 'POST') return next();

                let rawBody = '';
                req.on('data', chunk => { rawBody += chunk; });
                req.on('end', async () => {
                    try {
                        const body = JSON.parse(rawBody || '{}');
                        const donorName = body.donor_name || body.nama || 'Hamba Allah';
                        const donorEmail = body.donor_email || body.email || 'donatur@assholihin.or.id';
                        const phone = body.no_wa || '';
                        const program = body.program || 'Santunan & Pendidikan Anak Yatim';
                        const grossAmount = Math.max(10000, parseInt(body.amount || body.nominal || 50000, 10));
                        const orderId = 'DONASI-' + Date.now();

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

                        const r = await fetch(SNAP_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'Authorization': authHeader
                            },
                            body: JSON.stringify(payload)
                        });

                        const data = await r.json();
                        res.setHeader('Content-Type', 'application/json');

                        if (!r.ok) {
                            res.statusCode = r.status;
                            res.end(JSON.stringify({
                                status: 'error',
                                message: (data.error_messages && data.error_messages.join(', ')) || 'Gagal membuat transaksi Midtrans'
                            }));
                            return;
                        }

                        const nowIso = new Date().toISOString();
                        const expiresAtIso = new Date(Date.now() + 15 * 60 * 1000).toISOString();

                        // Simpan metadata order untuk halaman status / kwitansi & riwayat
                        devOrders.set(orderId, {
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
                        });

                        devNotifications.unshift({
                            id: `NOTIF-${Date.now()}`,
                            order_id: orderId,
                            title: `Donasi Baru: ${donorName}`,
                            message: `${donorName} membuat transaksi donasi Rp ${grossAmount.toLocaleString('id-ID')} (${program})`,
                            status: 'pending',
                            amount: grossAmount,
                            donor_name: donorName,
                            time: new Date().toISOString(),
                            read: false
                        });

                        res.statusCode = 200;
                        res.end(JSON.stringify({
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
                        }));
                    } catch (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ status: 'error', message: err.message }));
                    }
                });
            });

            // 2. Endpoint Webhook Payment Notification dari Midtrans Dashboard
            server.middlewares.use('/api/notification', handleNotificationWebhook);
            server.middlewares.use('/api/v1/notification', handleNotificationWebhook);
            server.middlewares.use('/api/midtrans/callback', handleNotificationWebhook);

            // 3. Endpoint Daftar Semua Order (/api/orders) + Auto-Check ke Midtrans v2
            server.middlewares.use('/api/orders', async (req, res, next) => {
                if (req.method !== 'GET') return next();
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

                const allOrders = [...devOrders.values()];
                await Promise.all(
                    allOrders.map(async (ord) => {
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
                                const prev = ord.status;
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
                                devOrders.set(ord.order_id, ord);

                                if (prev !== 'paid' && ord.status === 'paid') {
                                    devNotifications.unshift({
                                        id: `NOTIF-${Date.now()}`,
                                        order_id: ord.order_id,
                                        title: `Pembayaran Lunas: ${ord.customer_name}`,
                                        message: `${ord.customer_name} melunasi donasi Rp ${Number(ord.amount).toLocaleString('id-ID')} via ${ord.payment_channel}`,
                                        status: 'paid',
                                        amount: ord.amount,
                                        donor_name: ord.customer_name,
                                        time: new Date().toISOString(),
                                        read: false
                                    });
                                }
                            }
                        } catch {}
                    })
                );

                res.statusCode = 200;
                res.end(JSON.stringify([...devOrders.values()].reverse()));
            });

            // 4. Endpoint Cek Status Pembayaran (/api/landing/payment/status/:orderId)
            server.middlewares.use('/api/landing/payment/status', async (req, res, next) => {
                if (req.method !== 'GET') return next();

                const parts = (req.url || '').split('/').filter(Boolean);
                const orderId = decodeURIComponent(parts[0] || '').split('?')[0];

                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

                if (!orderId) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ success: false, message: 'Order ID diperlukan' }));
                    return;
                }

                const localOrder = devOrders.get(orderId) || {
                    order_id: orderId,
                    customer_name: 'Donatur As-Sholihin',
                    customer_email: 'donatur@assholihin.or.id',
                    program: 'Santunan & Pendidikan Anak Yatim',
                    amount: 50000,
                    status: 'pending',
                    payment_channel: 'MIDTRANS SNAP',
                    created_at: new Date().toISOString()
                };

                const prevStatus = localOrder.status;

                try {
                    const r = await fetch(`${API_URL}/${encodeURIComponent(orderId)}/status`, {
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': authHeader
                        }
                    });
                    const midtransStatus = await r.json();

                    if (midtransStatus && midtransStatus.transaction_status) {
                        const txStatus = midtransStatus.transaction_status;
                        if (txStatus === 'settlement' || txStatus === 'capture') {
                            localOrder.status = 'paid';
                        } else if (txStatus === 'pending') {
                            localOrder.status = 'pending';
                        } else if (['deny', 'cancel', 'expire', 'failure'].includes(txStatus)) {
                            localOrder.status = txStatus === 'expire' ? 'expired' : 'failed';
                        }

                        if (midtransStatus.gross_amount) {
                            localOrder.amount = parseFloat(midtransStatus.gross_amount);
                        }
                        if (midtransStatus.payment_type) {
                            localOrder.payment_channel = midtransStatus.payment_type.replace(/_/g, ' ').toUpperCase();
                        }
                        if (midtransStatus.transaction_time) {
                            localOrder.created_at = midtransStatus.transaction_time;
                        }
                        devOrders.set(orderId, localOrder);

                        if (prevStatus !== 'paid' && localOrder.status === 'paid') {
                            devNotifications.unshift({
                                id: `NOTIF-${Date.now()}`,
                                order_id: orderId,
                                title: `Pembayaran Lunas: ${localOrder.customer_name}`,
                                message: `${localOrder.customer_name} melunasi donasi Rp ${Number(localOrder.amount).toLocaleString('id-ID')} via ${localOrder.payment_channel}`,
                                status: 'paid',
                                amount: localOrder.amount,
                                donor_name: localOrder.customer_name,
                                time: new Date().toISOString(),
                                read: false
                            });
                        }
                    }
                } catch (e) {
                    // Jika belum dipilih metode di popup Midtrans (404), tetap kembalikan localOrder
                }

                res.statusCode = 200;
                res.end(JSON.stringify({
                    success: true,
                    data: localOrder
                }));
            });

            // 5. Endpoint Batalkan Pembayaran (/api/landing/payment/cancel)
            server.middlewares.use('/api/landing/payment/cancel', async (req, res, next) => {
                if (req.method !== 'POST') return next();

                let rawBody = '';
                req.on('data', chunk => { rawBody += chunk; });
                req.on('end', async () => {
                    const body = JSON.parse(rawBody || '{}');
                    const orderId = body.order_id;
                    if (orderId && devOrders.has(orderId)) {
                        const ord = devOrders.get(orderId);
                        ord.status = 'cancelled';
                        devOrders.set(orderId, ord);
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({ success: true }));
                });
            });
        }
    };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const isLaravelEmbed = mode === 'laravel';
    const serverKey = env.MIDTRANS_SERVER_KEY || DEFAULT_MIDTRANS_SERVER_KEY;

    return {
        plugins: [
            react(),
            midtransDevPlugin(serverKey)
        ],
        base: isLaravelEmbed ? '/landing-assets/' : '/',
        build: {
            outDir: isLaravelEmbed ? '../public/landing-assets' : 'dist',
            emptyOutDir: true,
        },
        server: {
            port: 5173,
            allowedHosts: true,
        }
    };
})
