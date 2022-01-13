import React from 'react'
import { MdPerson } from 'react-icons/md';
import HeaderUser from '../header/HeaderUser';

const AppHeader = () => {
  return (
    <nav className="bg-gradient-to-r from-theme-lightpurple to-theme-orange">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
        <h1>Hopzone</h1>
        <HeaderUser/>
      </div>
    </nav>
  )
}

export default AppHeader
