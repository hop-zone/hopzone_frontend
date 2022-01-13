import Link from 'next/link'
import React, { FormEvent, useState } from 'react'
import FormComponent, { FormItem, InputTypes } from 'src/components/forms'
import Button from 'src/components/forms/Button'
import DiscreteButton from 'src/components/forms/DiscreteButton'
import TextInput from 'src/components/forms/TextInput'
import PageLayout from 'src/components/layout'
import LandingPageLayout from 'src/components/layout/LandingPageLayout'

interface Credentials {
  email: string
  password: string
}

const Login = () => {
  const [submitting, setSubmitting] = useState(false)
  const [items, setItems] = useState<FormItem[]>([
    {
      id: 'email',
      value: '',
      label: 'E-Mail',
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
  ])


  const handleGuestBtn = () => {
    console.log('continuing as guest...')
  }

  const handleSubmit = (items: FormItem[]) => {

    console.log('submitted!');
    
    // console.log(items)
    // setForm({ ...form, submitting: true })
  }

  const handleLoginBtn = () => {
    setSubmitting(true)
  }

  return (
    <LandingPageLayout>
      <div className=" md:w-100 h-full m-auto p-8">
        <h1 className="text-theme-orange text-5xl font-semibold text-center mb-2">
          LOGIN
        </h1>
        <h2 className="text-center text-2xl mb-5">Welcome to Hopzone!</h2>
        <FormComponent
          setSubmitting={setSubmitting}
          submitting={submitting}
          items={items}
          setItems={setItems}
          onSubmit={handleSubmit}
        />
        <Button onClick={handleLoginBtn}>LOG IN</Button>

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
