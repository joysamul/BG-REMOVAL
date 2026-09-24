import { Link } from 'react-router-dom'

const BuyCredit = () => {
  return (
    <div className='min-h-[80vh] grid place-items-center px-6 text-center'>
      <div>
        <p className='text-sm uppercase tracking-wider text-violet-600'>Always free</p>
        <h1 className='mt-3 text-3xl font-semibold text-gray-800'>Remove backgrounds without credits</h1>
        <p className='mx-auto mt-4 max-w-md text-gray-500'>Upload as many images as you need and download clean transparent PNGs.</p>
        <Link className='mt-8 inline-flex rounded-full bg-gray-900 px-8 py-3 text-sm font-medium text-white' to='/'>Start removing backgrounds</Link>
      </div>
    </div>
  )
}

export default BuyCredit