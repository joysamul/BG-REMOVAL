import express from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'
import sharp from 'sharp'

const imageRouter = express.Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        callback(null, file.mimetype.startsWith('image/'))
    }
})

imageRouter.post('/remove-background', upload.single('image'), async (req, res) => {
    if (!process.env.REMOVE_BG_API_KEY) {
        return res.status(503).json({ success: false, message: 'Background removal service is not configured.' })
    }
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Please upload a PNG, JPG, or WEBP image.' })
    }

    try {
        const normalizedImage = await sharp(req.file.buffer, { failOn: 'none' })
            .rotate()
            .png()
            .toBuffer()
        const form = new FormData()
        form.append('image_file', normalizedImage, { filename: 'upload.png', contentType: 'image/png' })
        form.append('size', 'auto')
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
            headers: { ...form.getHeaders(), 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
            responseType: 'arraybuffer',
            timeout: 60000,
        })
        res.type('png').send(response.data)
    } catch (error) {
        let providerMessage = ''
        if (error.response?.data) {
            try {
                const providerBody = Buffer.from(error.response.data).toString('utf8')
                providerMessage = JSON.parse(providerBody).errors?.[0]?.title || providerBody
            } catch {
                providerMessage = ''
            }
        }
        console.error('Background removal failed:', providerMessage || error.message)
        res.status(error.response?.status || 502).json({
            success: false,
            message: providerMessage || 'This image could not be processed. Try a different image.'
        })
    }
})

export default imageRouter