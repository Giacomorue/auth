import React from 'react'
import ThemeSwitcher from './theme-switcher'
import Image from 'next/image'
import Link from 'next/link'

function Navbar() {
  return (
    <div className='w-full h-[70px] border-b shadow-sm shadow-foreground/20'>
      <div className='h-full container mx-auto flex flex-row items-center justify-between'>
        <Link href={"/"} className='text-3xl font-bold flex flex-row gap-2 items-center'>
          <Image 
            src={"/auth.png"}
            alt='logo'
            width={40}
            height={40}
            className='sm:block hidden'
          />
          Authly
        </Link>
        <ThemeSwitcher />
      </div>
    </div>
  )
}

export default Navbar