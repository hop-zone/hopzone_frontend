import React from 'react'
import TextInput from 'src/components/forms/TextInput'
import PageLayout from 'src/components/layout'
import LandingPageLayout from 'src/components/layout/LandingPageLayout'

const Login = () => {
    return (
        <LandingPageLayout>
            <div>
                <h1 className='text-theme-orange text-5xl font-semibold text-center mb-2'>LOGIN</h1>
                <h2 className='text-center text-2xl mb-5'>Welcome to Hopzone!</h2>
                <TextInput id='email' title='E-Mail'/>
                <TextInput id='password' title='Password' isPassword={true}/>
            </div>
        </LandingPageLayout>
    )
}

export default Login
