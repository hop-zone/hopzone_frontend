import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from 'src/components/forms/Button'
import PageLayout from 'src/components/layout'
import LobbyPlayers from 'src/components/lobby/LobbyPlayers'
import PageTitle from 'src/components/text/PageTitle'
import { Player } from 'src/models/player'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import { useAuth } from 'src/providers/AuthProvider'
import { SocketMessages, useSockets } from 'src/providers/SocketProvider'

const Lobby = () => {
  const router = useRouter()

  const { socket } = useAuth()
  const { getLobby } = useSockets()
  // const players: Player[] = [
  //   { displayName: 'Alexander' },
  //   { displayName: 'ee' },
  //   { displayName: 'Aleqwqxander' },
  //   { displayName: 'Aleddxander' },
  // ]

  const [players, setPlayers] = useState<Player[]>([])

  const handleStartGameClick = () => {
    router.push('/gamesession')
  }

  useEffect(() => {
    let mounted = true
    if (router.query.id && socket) {
      const id = parseInt(router.query.id as string)
      getLobby(id)

      socket.on(SocketMessages.currentLobby, (data: GameRoom) => {

        const players = data.players.map(p => {
          return { displayName: p.name ? p.name : 'Guest' }
        })
        if (mounted) {
          setPlayers(players)
        }
      })
    }

    return () => {
      mounted = false
    }
  }, [router, socket])

  return (
    <PageLayout>
      <div className="flex flex-col justify-between h-full gap-8">
        <div className="grid gap-8">
          <PageTitle>Lobby</PageTitle>
          <LobbyPlayers players={players} />
        </div>
        <Button onClick={handleStartGameClick} className=" max-w-md mx-auto">
          START GAME
        </Button>
      </div>
    </PageLayout>
  )
}

export default Lobby
