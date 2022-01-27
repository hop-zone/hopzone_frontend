import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MdArrowForward, MdPerson } from 'react-icons/md'
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
import { User } from 'src/models/serverModels/User'

const ENDPOINT = 'http://localhost:3001'

const Home: NextPage = () => {
  const router = useRouter()

  const { socket, user } = useAuth()
  const { connectionError } = useSockets()
  const [scoreBoard, setScoreBoard] = useState<User[]>([])

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

  const handleUpdateScoreboard = (data: User[]) => {
    const users = data.map(u => {
      if (u.highScoreDate) u.highScoreDate = new Date(u.highScoreDate)

      return u
    })
    setScoreBoard(users)
  }

  useEffect(() => {
    if (socket) {
      socket.emit(SocketMessages.getScoreboard)
      socket.on(SocketMessages.lobbyInfo, handleJoinLobby)
      socket.on(SocketMessages.scoreboard, handleUpdateScoreboard)
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
        <Card className="md:grid grid-cols-2 mb-8">
          <div className="p-8 max-w-xs mx-auto flex flex-col justify-between">
            <SubTitle className="text-center">Single Player</SubTitle>
            <p className=" mb-8">
              Don&apos;t want to play with other people? Have a slow internet
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
        <h2 className=" text-3xl text-theme-orange font-semibold mb-4">
          Top players
        </h2>
        <div className="md:grid grid-cols-2 gap-x-2">
          {scoreBoard.map(p => {
            return (
              <Card
                key={p.uid}
                className={` p-5 flex justify-between items-center text-2xl  mb-2`}
              >
                <div className="flex items-center gap-2">
                  <MdPerson size={24} />
                  <span>
                    {p.displayName + ' '}
                    {user?.uid == p.uid ? <span>(You)</span> : null}
                  </span>
                </div>
                <div>
                  <p className=' text-right text-orange-700'>{p.highScore}m</p>
                  <p className=' text-sm text-purple-400'>
                    {p.highScoreDate?.toLocaleString('en-us', {year: "numeric", month: "short", day: "2-digit"})}
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      </Authenticated>
    </PageLayout>
  )
}

export default Home
