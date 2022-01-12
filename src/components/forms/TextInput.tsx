import React, { FunctionComponent } from 'react'
import classNames from 'classnames/bind'


interface TextInputProps {
    id: string
    title: string
    isPassword?: boolean
}

const TextInput: FunctionComponent<TextInputProps> = ({id, title, isPassword = false}) => {
  const inputStyling = classNames(
    'p-4 border-purple-500 border-2 rounded-md bg-purple-300 text-purple-600 focus:outline-none',
  )

  return (
    <div className=' mb-5'>
      <label className='block mb-2 text-purple-300 text-sm' htmlFor={id}>{title}</label>
      <input
        className="p-4 border-purple-500 border-2 w-full rounded-lg bg-purple-300 text-purple-700 focus:outline-none placeholder-purple-500"
        placeholder="eg. john@doe.com"
        type={isPassword? 'password' : 'text'}
        id={id}
      />
    </div>
  )
}

export default TextInput
