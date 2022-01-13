import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import PageLayout from 'src/components/layout'
import PageTitle from 'src/components/text/PageTitle'
import SubTitle from 'src/components/text/SubTitle'
import { Authenticated, useAuth } from 'src/providers/AuthProvider'

const Home: NextPage = () => {

  return <PageLayout>
    <Authenticated>
      <PageTitle className=' text-center'>Hopzone</PageTitle>
      <SubTitle className='text-center'>Can you hop the highest?</SubTitle>
    </Authenticated>
  </PageLayout>
}

export default Home
