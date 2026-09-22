import React from 'react'

const Verify = () => {
  return (
    <div className='relative w-full h-[760px] overflow-hidden'>
      <div className='min-h-screen flex justify-center items-center bg-pink-100'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
                <h2 className='text-2xl font-semibold text-green-500 mb-4'>✅ Check Your Email</h2>
                <p className='text-gray-500 text-sm'>we sent the verification email. Please check your email inbox and click to verify </p>
        </div>

      </div>
    </div>
  )
}

export default Verify
