import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './configs/mongodb.js'    

// App Config
const PORT = process.env.PORT || 4000
const app = express()

// Intialize Middlewares
app.use(express.json())
app.use(cors())

// Keep the health check independent of external services.
app.get('/',(req,res)=> res.send("API Working"))

app.use(async (req, res, next) => {
	try {
		await connectDB()
		next()
	} catch (error) {
		next(error)
	}
})

app.use((error, req, res, next) => {
	console.error('Backend request failed:', error.message)
	res.status(503).json({
		error: 'Backend dependency unavailable',
		message: process.env.NODE_ENV === 'production'
			? 'The backend is missing a required service configuration.'
			: error.message
	})
})

if (process.env.NODE_ENV !== 'production') {
	app.listen(PORT, ()=> console.log("Server Running on port "+PORT))
}

export default app

