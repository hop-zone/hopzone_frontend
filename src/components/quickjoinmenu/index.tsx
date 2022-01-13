import Link from 'next/link'
import React, { FunctionComponent, useState } from 'react'
import { MdArrowForward } from 'react-icons/md'

interface IMenuItem {
  gameId?: string
  hostname: string
  playerCount: number
}

interface MenuItemProps {
  item: IMenuItem
}

const MenuItem: FunctionComponent<MenuItemProps> = ({ item }) => {
  return (
    <li className="flex justify-between border-b-2 border-purple-600 py-2">
      <p className='text-theme-orange'>{item.playerCount}/4</p>
      <span>
        {item.hostname}
        <Link href={'#'}>
          <a className='text-theme-orange hover:text-orange-800'>
            <MdArrowForward size={24} className="inline-block ml-2 " />
          </a>
        </Link>
      </span>
    </li>
  )
}

const QuickJoinMenu = () => {
  const menuItems: IMenuItem[] = [
    { hostname: 'Alexander', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
    { hostname: 'Kevin', playerCount: 1 },
  ]
  return (
    <ul className=' overflow-scroll mb-8'>
      {menuItems.map(item => {
        return <MenuItem item={item} />
      })}
    </ul>
  )
}

export default QuickJoinMenu
