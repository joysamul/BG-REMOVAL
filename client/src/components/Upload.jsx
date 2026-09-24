import { useContext, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/context'
import { assets } from '../assets/assets'

const Upload = () => {
    const inputRef = useRef(null)
    const navigate = useNavigate()
    const { removeBackground, error, isProcessing } = useContext(AppContext)

    const handleChange = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        const processed = await removeBackground(file)
        if (processed) navigate('/result')
        event.target.value = ''
    }

    return (
        <div className='pb-16'>
            {/*title*/}

            <h1 className='text-center text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent py-6 md:py-16'>See the magic. Try it now!</h1>

            <div className='text-center mb-24'>
                <input ref={inputRef} onChange={handleChange} accept="image/png,image/jpeg,image/webp" type="file" hidden />
                <button disabled={isProcessing} onClick={() => inputRef.current?.click()} className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 m-auto hover:scale-105 transition-all duration-700 disabled:opacity-60'>
                    <img width={20} src={assets.upload_btn_icon} alt=""></img>
                    <p className='text-white font-sm'>Upload Image</p>
                </button>
                {error && <p className='mt-3 text-sm text-red-600'>{error}</p>}
            </div>

        </div>
    )
}

export default Upload
