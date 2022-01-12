import React, { FunctionComponent } from 'react'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'

const PageLayout: FunctionComponent = ({ children }) => {
  return (
    <>
      <AppHeader />
      <div className='max-w-7xl py-12 px-4 mx-auto'>{children}</div>
      <AppFooter />
    </>
  )
}

export default PageLayout
