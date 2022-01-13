import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'

const Button: FunctionComponent<ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      className={` text-white py-3 w-full bg-theme-orange rounded-md hover:bg-orange-800 mb-4 font-semibold ${
        className ? className : ' '
      }`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
