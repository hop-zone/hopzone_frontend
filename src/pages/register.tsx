import Link from 'next/link'
import React, { useState } from 'react'
import Form, { FormItem, InputTypes } from 'src/components/forms'
import Button from 'src/components/forms/Button'
import LandingPageLayout from 'src/components/layout/LandingPageLayout'


const Register = () => {
  const [submitting, setSubmitting] = useState(false)
  const [items, setItems] = useState<FormItem[]>([
    {
      id: 'email',
      value: '',
      label: 'E-Mail',
      placeholder:'eg john@doe.com',
      type: InputTypes.EMAIL,
      required: true,
    },
    {
      id: 'password',
      value: '',
      label: 'Password',
      type: InputTypes.PASSWORD,
      required: true,
    },
    {
      id: 'repeatpasswword',
      value: '',
      label: 'Repeat Password',
      type: InputTypes.REPEATPASSWORD,
      required: true,
    },
  ])

  const handleSubmit = (formItems: FormItem[]) => {
      
  }

  const handleRegisterBtn = () => {
      setSubmitting(true)
  }

  return <LandingPageLayout>
      <div className=" md:w-100 h-full m-auto p-8">
        <h1 className="text-theme-orange text-5xl font-semibold text-center mb-2">
          REGISTER
        </h1>
        <h2 className="text-center text-2xl mb-5">Welcome to Hopzone!</h2>
        <Form
          setSubmitting={setSubmitting}
          submitting={submitting}
          items={items}
          setItems={setItems}
          onSubmit={handleSubmit}
        />
        <Button onClick={handleRegisterBtn}>REGISTER</Button>
        <p className=" text-sm text-purple-400 text-center">
          I already have an account, let me{' '}
          <Link href={'/login'}>
            <a className=" font-semibold">Login</a>
          </Link>
        </p>
      </div>
  </LandingPageLayout>
}

export default Register
