import express from 'express'
import multer from 'multer'
import axios from 'axios'
import FormData from 'form-data'

const imageRouter = express.Router()
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        callback(null, ['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype))
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
        const form = new FormData()
        form.append('image_file', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype })
        form.append('size', 'auto')
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
            headers: { ...form.getHeaders(), 'X-Api-Key': process.env.REMOVE_BG_API_KEY },
            responseType: 'arraybuffer',
            timeout: 60000,
        })
        res.type('png').send(response.data)
    } catch (error) {
        const message = error.response?.data?.errors?.[0]?.title || 'The image could not be processed.'
        res.status(error.response?.status || 502).json({ success: false, message })
    }
})

export default imageRouter