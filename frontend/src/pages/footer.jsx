import React from 'react'

const Footer = () => {
  return (
    <>
    <div className='footer bg-blend-color-dodge bg-orange-600 text-white py-4'>
      <div className='flex justify-center items-center gap-4'>
        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
          <img src="./images/facebook.png" alt="Facebook" className='h-8 w-8' />
        </a>
        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
          <img src="./images/instagram.png" alt="Instagram" className='h-8 w-8' />
        </a>
        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
          <img src="./images/twitter.png" alt="Twitter" className='h-8 w-8' />
        </a>
      </div>
      <p className='text-center mt-2'>© 2023 Your Company Name. All rights reserved.</p>

    </div>
      
    </>
  )
}

export default Footer
