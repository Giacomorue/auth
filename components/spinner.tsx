import React from 'react'
import { ClipLoader, DotLoader, MoonLoader } from "react-spinners"

function Spinner() {
  return (
    <div className='absolute top-0 h-full w-full flex flex-col items-center justify-center inset-0 z-[100] bg-foreground/20'>
      <ClipLoader size={80} />
    </div>
  )
}

export default Spinner;