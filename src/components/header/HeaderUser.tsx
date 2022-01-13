import Link from 'next/link'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { IconType } from 'react-icons'
import { MdLogout, MdPerson } from 'react-icons/md'
import { useAuth } from 'src/providers/AuthProvider'

interface DropDownItemProps {
  Icon: IconType
  href: string
  title: string
  onClick?: React.MouseEventHandler<HTMLLIElement | undefined>
}

const DropDownItem: FunctionComponent<DropDownItemProps> = ({
  Icon,
  href,
  title,
  onClick,
}) => {
  return (
    <Link href={href}>
      <li
        className="  p-4 border-1 border-blue-200 hover:cursor-pointer hover:bg-blue-100"
        onClick={onClick}
      >
        <div className=" flex items-center gap-2">
          {<Icon size={24} className=" text-purple-900" />}
          <a className="whitespace-nowrap text-purple-700">{title}</a>
        </div>
      </li>
    </Link>
  )
}

const UserDropDown = () => {
  const { logout } = useAuth()
  return (
    <div className=" w-48 z-50 absolute top-16 right-0 bg-white border-2 rounded-lg border-orange-600 shadow">
      <ul>
        <DropDownItem
          Icon={MdLogout}
          onClick={logout}
          title={'Sign Out'}
          href="/login"
        />
      </ul>
    </div>
  )
}

const HeaderUser = () => {
  const { user } = useAuth()
  const divRef = useRef<HTMLDivElement>(null)
  const [isOpen, setisOpen] = useState(false)

  const handleClickOutside = (e: MouseEvent) => {
    if (divRef.current?.contains(e.target as Node)) {
      return
    }
    setisOpen(false)
  }

  const handleOpenProfile = () => {
    setisOpen(!isOpen)
  }

  useEffect(() => {
    document.addEventListener('mouseup', handleClickOutside)

    return () => {
      document.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])
  return (
    <div ref={divRef} className="flex items-center gap-4 relative">
      <p className="">{user?.isAnonymous ? 'Guest' : user?.displayName}</p>
      <div
        onClick={handleOpenProfile}
        className=" rounded-3xl hover:bg-orange-800 hover:cursor-pointer  p-1"
      >
        <MdPerson size={24} />
      </div>
      {isOpen ? <UserDropDown /> : null}
    </div>
  )
}

export default HeaderUser
