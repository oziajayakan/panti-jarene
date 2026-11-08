import { query, setCorsHeaders } from '../_lib/db.js';

export default async function handler(req, res) {
    // Handle CORS
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get latest 6 photos from gallery
        const photos = await query(`
            SELECT 
                id_foto as id,
                judul as title,
                deskripsi as description,
                path_foto as image_url
            FROM foto_kegiatan
            ORDER BY created_at DESC
            LIMIT 6
        `);

        // Format response - convert relative paths to full URLs if needed
        const formattedPhotos = photos.map(photo => ({
            id: photo.id,
            title: photo.title,
            description: photo.description,
            // For now, return path as-is. In production, you might need to prepend base URL
            // or serve images from cloud storage
            image_url: photo.image_url ? photo.image_url.replace(/ /g, '%20') : null
        }));

        return res.status(200).json(formattedPhotos);

    } catch (error) {
        console.error('Error fetching gallery:', error);
        return res.status(500).json({
            error: 'Server Error',
            message: error.message
        });
    }
}
