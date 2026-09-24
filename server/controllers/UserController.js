import { Webhook } from 'svix'
import userModel from '../models/userModel.js'


const clerkWebhooks = async (req, res) => {
    if (!process.env.CLERK_WEBHOOK_SECRET) {
        return res.status(500).json({ success: false, message: 'CLERK_WEBHOOK_SECRET is not configured' })
    }

    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    const payload = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body)
    const headers = {
        'svix-id': req.headers['svix-id'],
        'svix-timestamp': req.headers['svix-timestamp'],
        'svix-signature': req.headers['svix-signature']
    }

    let event
    try {
        event = webhook.verify(payload, headers)
    } catch (error) {
        console.error('Clerk webhook signature verification failed:', error.message)
        return res.status(400).json({ success: false, message: 'Webhook signature verification failed' })
    }

    try {
        const { data, type } = event

        if (!data?.id || !type) {
            return res.status(400).json({ success: false, message: 'Invalid Clerk webhook payload' })
        }

        if (type === 'user.created' || type === 'user.updated') {
            const email = data.email_addresses?.[0]?.email_address
            if (!email) {
                return res.status(400).json({ success: false, message: 'Clerk user has no email address' })
            }

            await userModel.findOneAndUpdate(
                { clerkId: data.id },
                {
                    clerkId: data.id,
                    email,
                    firstName: data.first_name || undefined,
                    lastName: data.last_name || undefined,
                    photo: data.image_url || undefined
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            )
        } else if (type === 'user.deleted') {
            await userModel.findOneAndDelete({ clerkId: data.id })
        }

        return res.status(200).json({ success: true, type })
    } catch (error) {
        console.error('Clerk webhook database processing failed:', error.message)
        return res.status(500).json({ success: false, message: 'Webhook database processing failed' })
    }
}



// api controler function to get user available credit data

const userCredits = async (req, res) => {
    try {

        const { clerkId } = req.body


        const userData = await userModel.findOne({ clerkId })

        res.json({ success: true, credits: userData.creditBalance })

    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message })

    }

}





export { clerkWebhooks , userCredits }