import http from 'node:http';
import mysql from 'mysql2/promise';

const PORT = process.env.API_PORT || 3001;

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'panti_asuhan_db',
    waitForConnections: true,
    connectionLimit: 10
});

function sendJson(res, status, data) {
    res.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(JSON.stringify(data));
}

function readBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk;
        });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });
}

function calcAge(tanggalLahir) {
    if (!tanggalLahir) return 10;
    const birth = new Date(tanggalLahir);
    const diff = Date.now() - birth.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
        return sendJson(res, 204, {});
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);
    const path = url.pathname;

    try {
        // Health check
        if (path === '/api/health' && req.method === 'GET') {
            await pool.query('SELECT 1');
            return sendJson(res, 200, { ok: true, database: 'panti_asuhan_db' });
        }

        // GET /api/anak
        if (path === '/api/anak' && req.method === 'GET') {
            const [rows] = await pool.query('SELECT * FROM anak ORDER BY id_anak DESC');
            const mapped = rows.map((r) => ({
                id: r.id_anak,
                nama: r.nama,
                jk: r.jenis_kelamin === 'P' ? 'Perempuan' : 'Laki-laki',
                usia: calcAge(r.tanggal_lahir),
                kategori:
                    r.status_anak === 'YATIM_PIATU'
                        ? 'Yatim Piatu'
                        : r.status_anak === 'PIATU'
                        ? 'Piatu'
                        : 'Yatim',
                jenjang: 'Asrama Panti',
                sekolah: r.alamat_asal || 'Candimulyo, Jombang',
                hafalan: 'Juz 30',
                kesehatan: 'Sehat Baik',
                statusMukim: 'Mukim Asrama',
                statusWali: r.nama_wali ? `Wali: ${r.nama_wali}` : 'Tanpa Wali / Terlantar',
                dokumenHukum: 'Lengkap (Akta + Berita Acara Dinsos)',
                kondisiPsikologis: 'Stabil & Siap Adaptasi',
                latarBelakang: r.alasan_masuk || 'Santri asuh Panti Asuhan As-Sholihin.'
            }));
            return sendJson(res, 200, mapped);
        }

        // POST /api/anak
        if (path === '/api/anak' && req.method === 'POST') {
            const body = await readBody(req);
            const jk = body.jk === 'Perempuan' ? 'P' : 'L';
            const statusAnak =
                body.kategori === 'Yatim Piatu'
                    ? 'YATIM_PIATU'
                    : body.kategori === 'Piatu'
                    ? 'PIATU'
                    : 'YATIM';
            const birthYear = new Date().getFullYear() - Number(body.usia || 8);
            const tanggalLahir = `${birthYear}-01-01`;

            const [result] = await pool.query(
                `INSERT INTO anak (nama, jenis_kelamin, tanggal_lahir, status_anak, alasan_masuk, tanggal_masuk)
                 VALUES (?, ?, ?, ?, ?, CURDATE())`,
                [body.nama, jk, tanggalLahir, statusAnak, body.latarBelakang || '']
            );
            return sendJson(res, 201, { id: result.insertId, ...body });
        }

        // DELETE /api/anak/:id
        if (path.startsWith('/api/anak/') && req.method === 'DELETE') {
            const id = path.split('/').pop();
            await pool.query('DELETE FROM anak WHERE id_anak = ?', [id]);
            return sendJson(res, 200, { deleted: true, id });
        }

        // GET /api/kas
        if (path === '/api/kas' && req.method === 'GET') {
            const [rows] = await pool.query(
                'SELECT * FROM transaksi_kas ORDER BY tanggal DESC, id_transaksi DESC LIMIT 100'
            );
            return sendJson(res, 200, rows);
        }

        // GET /api/galeri
        if (path === '/api/galeri' && req.method === 'GET') {
            const [rows] = await pool.query(
                'SELECT * FROM foto_kegiatan ORDER BY tanggal_kegiatan DESC'
            );
            return sendJson(res, 200, rows);
        }

        // GET /api/donasi
        if (path === '/api/donasi' && req.method === 'GET') {
            const [rows] = await pool.query(
                'SELECT * FROM donasi ORDER BY tanggal_donasi DESC LIMIT 100'
            );
            return sendJson(res, 200, rows);
        }

        return sendJson(res, 404, { error: 'Endpoint tidak ditemukan' });
    } catch (err) {
        console.error('API Error:', err.message);
        return sendJson(res, 500, { error: err.message });
    }
});

server.listen(PORT, () => {
    console.log(`MySQL API Server berjalan di http://localhost:${PORT} (DB: panti_asuhan_db)`);
});
