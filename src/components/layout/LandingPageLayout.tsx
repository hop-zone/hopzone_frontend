import React, { FunctionComponent } from 'react'
import Image from 'next/image'

const LandingPageLayout: FunctionComponent = ({ children }) => {
  return (
    <div className="md:flex">
      <div className="w-full h-fitscreen md:h-screen bg-purple-600 col-span-3 relative">
        <Image src={'/img/landing_img.png'} layout='fill' objectFit='cover' quality={100}/>
      </div>
      {children}
    </div>
  )
}

export default LandingPageLayout
