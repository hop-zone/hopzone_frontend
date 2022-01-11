import React, { FunctionComponent } from 'react'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'

const PageLayout: FunctionComponent = ({ children }) => {
  return (
    <>
      <AppHeader />
      {children}
      <AppFooter />
    </>
  )
}

export default PageLayout
