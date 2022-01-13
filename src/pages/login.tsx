import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { FormEvent, useState } from 'react'
import FormComponent, { FormItem, InputTypes } from 'src/components/forms'
import Button from 'src/components/forms/Button'
import DiscreteButton from 'src/components/forms/DiscreteButton'
import TextInput from 'src/components/forms/TextInput'
import PageLayout from 'src/components/layout'
import LandingPageLayout from 'src/components/layout/LandingPageLayout'
import {
  FirebaseError,
  LoginResponse,
  useAuth,
} from 'src/providers/AuthProvider'

interface Credentials {
  email: string
  password: string
}

const Login = () => {
  const { login } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [items, setItems] = useState<FormItem[]>([
    {
      id: 'email',
      value: '',
      label: 'E-Mail',
      type: InputTypes.EMAIL,
      required: true,
      placeholder: 'eg. john@doe.com'
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

  const handleSubmit = (formItems: FormItem[]) => {
    setLoading(true)
    const email = formItems[0].value
    const password = formItems[1].value

    login(email, password)
      .then(r => {
        if (r.success) {
          router.push('/')
        }
      })
      .catch((error: LoginResponse) => {
        console.log(error)

        if (error.errCode == FirebaseError.wrongPassword) {
          setLoading(false)
          formItems[1].isFaulty = true
          formItems[1].error = 'Wrong password'
          setItems(items)
        }

        if (error.errCode == FirebaseError.userNotFound) {
          setLoading(false)
          formItems[0].isFaulty = true
          formItems[0].error = 'Address not in use'
          setItems(items)
        }

        if (error.errCode == FirebaseError.tooManyRequests) {
          console.log('too many requests')
        }
      })
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
        {loading ? (
          <p className=" text-center mb-4">Please wait...</p>
        ) : (
          <Button onClick={handleLoginBtn}>LOG IN</Button>
        )}
        <p className=" text-sm text-purple-400 text-center">
          I don't have an account, let me{' '}
          <Link href={'/register'}>
            <a className=" font-semibold">Register</a>
          </Link>
        </p>
      </div>
    </LandingPageLayout>
  )
}

export default Login
