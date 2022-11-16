import React from 'react'
import LandingMenu from "../landingMenu"

function LandingLayout({children}) {
  return (
    <div className='flex flex-col w-full p-4'>
        <LandingMenu/>
        {children}
    </div>
  )
}

export default LandingLayout