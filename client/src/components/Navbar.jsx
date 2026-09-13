import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/react'

const Navbar = () => {
return (
    <div className='flex items-center justify-between mx-4 py-3 lg:mx-44'>
      <Link to="/"><img className='w-32 sm:w-44' src={assets.logo} alt="logo" /></Link>
      <div className='flex items-center gap-4'>
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className='bg-transparent text-zinc-800 hover:text-violet-600 font-medium text-sm'>
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className='bg-zinc-800 text-white flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-sm rounded-full hover:bg-zinc-700 transition-colors'>
              Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="arrow" />
            </button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <UserButton afterSignOutUrl="/" />
        </Show>
      </div>
    </div>
  )
}

export default Navbar


