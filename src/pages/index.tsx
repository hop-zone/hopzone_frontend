import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import PageLayout from 'src/components/layout'
import { useAuth } from 'src/providers/AuthProvider'

const Home: NextPage = () => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(user){
      console.log(user);
      
    }else{
      router.push('/login')
      
    }
    
  }, [user])
  return <PageLayout></PageLayout>
}

export default Home
