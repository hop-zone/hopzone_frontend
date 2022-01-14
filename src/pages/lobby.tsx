import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from 'src/components/forms/Button'
import PageLayout from 'src/components/layout'
import LobbyPlayers from 'src/components/lobby/LobbyPlayers'
import PageTitle from 'src/components/text/PageTitle'
import useLeaveLobbyPrompt from 'src/hooks/useLeaveLobbyPrompt'
import { useWarnLeaveLobby } from 'src/hooks/useWarnLeaveLobby'
import { Player } from 'src/models/player'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import { useAuth } from 'src/providers/AuthProvider'
import { SocketMessages, useSockets } from 'src/providers/SocketProvider'

const Lobby = () => {
  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  useWarnLeaveLobby(router.query.id)

  const { socket } = useAuth()
  const { joinLobby, leaveLobby } = useSockets()

  const [players, setPlayers] = useState<Player[]>([])

  const handleStartGameClick = () => {
    router.push('/gamesession')
  }

  useEffect(() => {
    let mounted = true
    setLoaded(false)
    if (router.query.id && socket) {
      const id = parseInt(router.query.id as string)
      joinLobby(id)
      socket.on(SocketMessages.lobbyInfo, (data: GameRoom) => {
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
  }, [socket])

  useEffect(() => {
    if (router) {

      setLoaded(true)
    }
  }, [router])

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
