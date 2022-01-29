import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import Form, { FormItem, InputTypes } from 'src/components/forms'
import Button from 'src/components/forms/Button'
import LandingPageLayout from 'src/components/layout/LandingPageLayout'
import {
  FirebaseError,
  LoginResponse,
  useAuth,
} from 'src/providers/AuthProvider'

const Register = () => {
  const { register } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [items, setItems] = useState<FormItem[]>([
    {
      id: 'username',
      value: '',
      label: 'Username',
      placeholder: 'eg John Doe',
      type: InputTypes.TEXT,
      required: true,
    },
    {
      id: 'email',
      value: '',
      label: 'E-Mail',
      placeholder: 'eg john@doe.com',
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
    setLoading(true)
    const userName = formItems[0].value
    const email = formItems[1].value
    const password = formItems[2].value

    register(email, password, userName)
      .then(r => {
        router.push('/')
      })
      .catch((e: LoginResponse) => {

        
        if (e.errCode == FirebaseError.weakPassword) {
          setLoading(false)
          formItems[2].isFaulty = true
          formItems[2].error = 'Password too weak'
          setItems(formItems)
        }

        if(e.errCode == FirebaseError.emailInUse){
          setLoading(false)
          formItems[1].isFaulty = true
          formItems[1].error = 'Email already in use'
          setItems(formItems)
        }
        if(e.errCode == FirebaseError.invalidEmail){
          setLoading(false)
          formItems[1].isFaulty = true
          formItems[1].error = 'Invalid email'
          setItems(formItems)
        }
      })
  }

  const handleRegisterBtn = () => {
    setSubmitting(true)
  }

  return (
    <LandingPageLayout>
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
        {loading ? (
          <p className=" text-center mb-4">Please wait...</p>
        ) : (
          <Button onClick={handleRegisterBtn}>REGISTER</Button>
        )}
        <p className=" text-sm text-purple-400 text-center">
          I already have an account, let me{' '}
          <Link href={'/login'}>
            <a className=" font-semibold">Login</a>
          </Link>
        </p>
      </div>
    </LandingPageLayout>
  )
}

export default Register
