import React, { FunctionComponent } from 'react'

const LandingPageLayout: FunctionComponent = ({ children }) => {
  return (
    <div className="md:flex">
      <div className=" w-full h-screen bg-purple-600 col-span-3"></div>
      {children}
    </div>
  )
}

export default LandingPageLayout
