import React from 'react'
import { MdPerson } from 'react-icons/md';

const AppHeader = () => {
  return (
    <nav className="bg-gradient-to-r from-theme-lightpurple to-theme-orange">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between">
        <h1>Hopzone</h1>
        <div>
            <MdPerson size={24}/>
        </div>
      </div>
    </nav>
  )
}

export default AppHeader
