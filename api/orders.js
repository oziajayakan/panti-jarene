import { setCorsHeaders } from './_lib/db.js';

export default async function handler(req, res) {
    setCorsHeaders(res);
    res.setHeader('Cache-Control', 'no-store');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    return res.status(200).json([]);
}
