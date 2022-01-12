import Link from 'next/link'
import React from 'react'
import Button from 'src/components/forms/Button'
import DiscreteButton from 'src/components/forms/DiscreteButton'
import TextInput from 'src/components/forms/TextInput'
import PageLayout from 'src/components/layout'
import LandingPageLayout from 'src/components/layout/LandingPageLayout'

const Login = () => {
  const handleLoginBtn = () => {
    console.log('logging in ...')
  }

  const handleGuestBtn = () => {
    console.log('continuing as guest...')
  }

  return (
    <LandingPageLayout>
      <div className=" md:w-100 m-auto p-8">
        <h1 className="text-theme-orange text-5xl font-semibold text-center mb-2">
          LOGIN
        </h1>
        <h2 className="text-center text-2xl mb-5">Welcome to Hopzone!</h2>
        <TextInput id="email" title="E-Mail" />
        <TextInput id="password" title="Password" isPassword={true} />
        <Button onClick={handleLoginBtn}>LOGIN</Button>
        <DiscreteButton onClick={handleGuestBtn} className=" mx-auto">
          CONTINUE AS GUEST
        </DiscreteButton>
        <p className=" text-sm text-purple-400 text-center">
          I don't have an account, let me{' '}
          <Link href={'#'}>
            <a className=" font-semibold">Register</a>
          </Link>
        </p>
      </div>
    </LandingPageLayout>
  )
}

export default Login
