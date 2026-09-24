import { useState } from "react";
import { AppContext } from './context'
const AppContextProvider = (props) => {
    const [credit, setCredit] = useState(null)
    const [originalImage, setOriginalImage] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://bg-removal-js.vercel.app'

    const prepareUpload = async (file) => {
        if (file.size <= 3.8 * 1024 * 1024) return file

        const bitmap = await createImageBitmap(file)
        const maxDimension = 2400
        const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(bitmap.width * scale))
        canvas.height = Math.max(1, Math.round(bitmap.height * scale))
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
        bitmap.close()

        for (const quality of [0.88, 0.76, 0.62, 0.48]) {
            const compressed = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality))
            if (compressed && compressed.size <= 3.8 * 1024 * 1024) {
                return new File([compressed], `${file.name.replace(/\.[^.]+$/, '')}.jpg`, { type: 'image/jpeg' })
            }
        }

        throw new Error('This image is too large to process. Please choose an image under 25 MB.')
    }

    const removeBackground = async (file) => {
        setError('')
        setIsProcessing(true)
        setOriginalImage(URL.createObjectURL(file))
        setResultImage(null)

        try {
            const upload = await prepareUpload(file)
            const formData = new FormData()
            formData.append('image', upload)
            const response = await fetch(`${backendUrl}/api/image/remove-background`, {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                const body = await response.json().catch(() => ({}))
                throw new Error(body.message || 'Unable to remove the background.')
            }

            setResultImage(URL.createObjectURL(await response.blob()))
            return true
        } catch (requestError) {
            setError(requestError.message || 'Unable to remove the background.')
            return false
        } finally {
            setIsProcessing(false)
        }
    }

    const resetResult = () => {
        setOriginalImage(null)
        setResultImage(null)
        setError('')
    }

    const value = {
        backendUrl,
        credit,
        originalImage,
        resultImage,
        isProcessing,
        error,
        removeBackground,
        resetResult,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider