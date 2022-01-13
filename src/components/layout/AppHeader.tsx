import Link from 'next/link'
import React from 'react'
import { MdPerson } from 'react-icons/md'
import { Authenticated, NotAuthenticated } from 'src/providers/AuthProvider'
import Button from '../forms/Button'
import HeaderUser from '../header/HeaderUser'

const AppHeader = () => {
  return (
    <nav className="bg-gradient-to-r from-theme-lightpurple to-theme-orange ">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
        <Link href={'/'}>
          <a>Hopzone</a>
        </Link>

        <Authenticated>
          <HeaderUser />
        </Authenticated>
      </div>
    </nav>
  )
}

export default AppHeader
