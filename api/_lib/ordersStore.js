const DEFAULT_SERVER_KEY = ['Mid', 'server', 'kpk1coOv1VAbEYHxbi6ckMF1'].join('-');
const SNAP_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const API_URL = 'https://api.sandbox.midtrans.com/v2';

// Global store agar bertahan antar pemanggilan serverless yang masih hangat
if (!globalThis.__ASSHOLIHIN_ORDERS__) {
    globalThis.__ASSHOLIHIN_ORDERS__ = new Map();
}
if (!globalThis.__ASSHOLIHIN_NOTIFICATIONS__) {
    globalThis.__ASSHOLIHIN_NOTIFICATIONS__ = [];
}

export const ordersStore = globalThis.__ASSHOLIHIN_ORDERS__;
export const notificationsStore = globalThis.__ASSHOLIHIN_NOTIFICATIONS__;

export function getMidtransAuthHeader() {
    const serverKey = process.env.MIDTRANS_SERVER_KEY || DEFAULT_SERVER_KEY;
    return 'Basic ' + Buffer.from(serverKey + ':').toString('base64');
}

export function getMidtransServerKey() {
    return process.env.MIDTRANS_SERVER_KEY || DEFAULT_SERVER_KEY;
}

export { SNAP_URL, API_URL };
