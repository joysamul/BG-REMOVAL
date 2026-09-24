import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/context'

const Result = () => {
  const { originalImage, resultImage, isProcessing, error, resetResult } = useContext(AppContext)

  return (
    <div className='mx-4 my-3 lg:mx-44 mt-14 min-h-[75vh]'>

      <div className='bg-white rounded-lg px-8 py-6 drop-shadow-sm'>
        {/* Result content goes here */}
        <div className='flex flex-col sm:grid grid-cols-2 gap-8 '>
          {/* left side */}
          <div>
            <p className='font-semibold text-gray-600 mb-2'>Original </p>
            <img className='rounded-md border w-full' src={originalImage || assets.image_w_bg} alt="Original upload" />
          </div>

          {/* right side */}
          <div className='flex flex-col '>
            <p className='font-semibold text-gray-600 mb-2'>Background Removed </p>
            <div className='rounded-md border border-gray-300 h-full relative bg-layer overflow-hidden'>
              <img className='w-full' src={resultImage || assets.image_wo_bg} alt="Background removed" />
              {isProcessing && <div className='absolute inset-0 grid place-items-center bg-white/70'>
                <div className='border-4 border-violet-600 rounded-full h-12 w-12 border-t-transparent animate-spin'> </div>
              </div>}
            </div>
          </div>
        </div>

{/* {buttons} */}
<div className='flex justify-center sm:justify-end items-center flex-wrap gap-4 mt-6'>
  {error && <p className='w-full text-center text-sm text-red-600'>{error}</p>}
  <Link onClick={resetResult} className='px-8 py-2.5 text-violet-600 text-sm border border-violet-600 rounded-full hover:scale-105 transition-all duration-700' to="/">Try another image</Link>
  {resultImage && <a className='px-8 py-2.5 text-white text-sm bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full hover:scale-105 transition-all duration-700' href={resultImage} download="background-removed.png">Download image</a>}
</div>

      </div>
    </div>
  )
}

export default Result
