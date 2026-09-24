import { useState } from "react";
import { useAuth } from '@clerk/react'
import { AppContext } from './context'
const AppContextProvider = (props) => {
    const [credit, setCredit] = useState(null)
    const [originalImage, setOriginalImage] = useState(null)
    const [resultImage, setResultImage] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [error, setError] = useState('')
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
    const { getToken } = useAuth()

    const removeBackground = async (file) => {
        setError('')
        setIsProcessing(true)
        setOriginalImage(URL.createObjectURL(file))
        setResultImage(null)

        try {
            const formData = new FormData()
            formData.append('image', file)
            const token = await getToken()
            const response = await fetch(`${backendUrl}/api/image/remove-background`, {
                method: 'POST',
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
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