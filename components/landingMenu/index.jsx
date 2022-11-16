import React from 'react'
import Link from 'next/link'
import {useCurrentUser} from "../hooks/auth/useCurrentUser"

function LandingMenu() {
  const currentUser = useCurrentUser();
 
  return (
    <div className='flex w-full'>
       <div className='p-2 text-4xl font-bold'> 
        <Link href={"/"}>WEP</Link>
        </div>
        <div className='p-2 ml-auto text-xl'> 
        {!currentUser ? <Link href={"/login"}>Iniciar Sesión</Link> : <Link href={"/dashboard"}>Dashboard</Link>}
        </div>
    </div>
  )
}

export default LandingMenu