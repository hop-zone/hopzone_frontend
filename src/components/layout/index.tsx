import { useRouter } from 'next/router'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAuth } from 'src/providers/AuthProvider'
import AppFooter from './AppFooter'
import AppHeader from './AppHeader'

const PageLayout: FunctionComponent = ({ children }) => {
  const { user, loaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loaded && !user) {
      router.push('/login')
    }
  }, [user, loaded])
  return (
    <>
      <AppHeader />
      <div className="max-w-7xl py-12 px-4 mx-auto">{children}</div>
      <AppFooter />
    </>
  )
}

export default PageLayout
