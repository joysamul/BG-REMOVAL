import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AppContext } from '../context/context'
import { assets } from '../assets/assets'

const Header = () => {
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
        <div className='flex items-center justify-between max-sm:flex-col-reverse gap-y-10 px-4 mt-10 lg:px-44 sm:mt-20'>
            {/* Header content goes here left side*/}
            <div>
                <h1 className='text-4xl xl:text-5xl 2xl:text-6xl font-bold text-neutral-700 leading-tight'>
                    Remove the <br className='max-md:hidden' /> <span className='bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent'> background </span> from  <br className='max-md:hidden' /> images for free.</h1>
                <p className='my-6 text-[15px] text-gray-500 '>
                    Upload your image and<br className='max-sm:hidden' /> remove the background in seconds.
                </p>
                <div>
                    <input ref={inputRef} onChange={handleChange} accept="image/png,image/jpeg,image/webp" type="file" hidden />
                    <button disabled={isProcessing} onClick={() => inputRef.current?.click()} className='inline-flex gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 m-auto hover:scale-105 transition-all duration-700 disabled:opacity-60'>
                        <img width={20} src={assets.upload_btn_icon} alt=""></img>
                        <p className='text-white font-sm'>Upload Image</p>
                    </button>
                    {error && <p className='mt-3 max-w-sm text-sm text-red-600'>{error}</p>}
                </div>
            </div>

            {/* Header content goes here right side*/}

            <div>
<img className='w-full max-w-md' src={assets.header_img} alt="header" />
            </div>
        </div>
    )
}

export default Header
