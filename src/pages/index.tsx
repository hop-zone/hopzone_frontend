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
import { SocketMessages, useSockets } from 'src/providers/SocketProvider'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import ConnectionError from 'src/components/errors/ConnectionError'

const ENDPOINT = 'http://localhost:3001'

const Home: NextPage = () => {
  const router = useRouter()

  const { socket } = useAuth()
  const { connectionError } = useSockets()

  const handleCreatLobbyClick = () => {
    socket?.emit('f2b_newLobby')
  }
  const handleSingleplayerClick = () => {
    router.push('/gamesession')
  }

  const handleJoinLobby = (data: GameRoom) => {
    console.log('pushing')

    console.log(data)

    router.push(`/lobby?id=${data.roomId}`)
  }

  useEffect(() => {
    if (socket) {
      socket.on(SocketMessages.lobbyInfo, handleJoinLobby)
    }

    return () => {
      // socket?.disconnect()
      socket?.off(SocketMessages.lobbyInfo, handleJoinLobby)
    }
  }, [socket])

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
            {connectionError ? (
              <div className=" flex flex-col items-center">
                <SubTitle className="text-center">Quick Join</SubTitle>
                <ConnectionError />
              </div>
            ) : (
              <div className="flex flex-col justify-between min-h-full max-h-96 max-w-md mx-auto">
                <SubTitle className="text-center">Quick Join</SubTitle>
                <QuickJoinMenu />
                <Button onClick={handleCreatLobbyClick}>CREATE NEW</Button>
              </div>
            )}
          </div>
        </Card>
      </Authenticated>
    </PageLayout>
  )
}

export default Home
