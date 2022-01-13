import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MdArrowForward } from 'react-icons/md'
import Card from 'src/components/card'
import Button from 'src/components/forms/Button'
import PageLayout from 'src/components/layout'
import QuickJoinMenu from 'src/components/quickjoinmenu'
import PageTitle from 'src/components/text/PageTitle'
import SubTitle from 'src/components/text/SubTitle'
import { Authenticated, useAuth } from 'src/providers/AuthProvider'

const Home: NextPage = () => {
  const router = useRouter()

  const handleSingleplayerClick = () => {
    router.push('/gamesession')
  }

  return (
    <PageLayout>
      <Authenticated>
        <PageTitle className=" text-center">Hopzone</PageTitle>
        <SubTitle className="text-center">Can you hop the highest?</SubTitle>
        <Card className="md:grid grid-cols-2">
          <div className="p-8 max-w-xs mx-auto flex flex-col justify-between">
            <SubTitle className="text-center">Single Player</SubTitle>
            <p className=" mb-8">
              Don't want to play with other people? Have a slow internet
              connection? Want to pass time alone? Start your own single player
              game!
            </p>
            <Button
              onClick={handleSingleplayerClick}
              className="flex justify-center"
            >
              <MdArrowForward size={20} />
            </Button>
          </div>
          <div className=" bg-purple-700 rounded-br-lg rounded-bl-lg md:rounded-bl-none md:rounded-tr-lg p-8">
            <div className="flex flex-col justify-between min-h-full max-h-96 max-w-md mx-auto">
              <SubTitle className="text-center">Quick Join</SubTitle>
              <QuickJoinMenu />
              <Button>CREATE NEW</Button>
            </div>
          </div>
        </Card>
      </Authenticated>
    </PageLayout>
  )
}

export default Home
