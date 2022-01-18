import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Button from 'src/components/forms/Button'
import PageLayout from 'src/components/layout'
import LobbyPlayers from 'src/components/lobby/LobbyPlayers'
import PageTitle from 'src/components/text/PageTitle'
import TestMultiplayer from 'src/game/testMultiplayer'
import { useWarnLeaveLobby } from 'src/hooks/useWarnLeaveLobby'
import { User } from 'src/models/serverModels/User'
import { useAuth } from 'src/providers/AuthProvider'
import { useSockets } from 'src/providers/SocketProvider'

const Lobby = () => {
  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  const { socket, user } = useAuth()
  const { joinLobby, gameState } = useSockets()
  const [hostId, setHostId] = useState('')
  const [players, setPlayers] = useState<User[]>([])

  useWarnLeaveLobby(router.query.id)

  const handleStartGameClick = () => {
    if (socket) {
      console.log('sending start game request')
      socket.emit('f2b_startGame', router.query.id as string)
    }
  }

  useEffect(() => {
    let mounted = true
    setLoaded(false)
    if (router.query.id && socket) {
      joinLobby(router.query.id as string)
    }

    return () => {
      mounted = false
    }
  }, [socket])

  useEffect(() => {
    if (gameState) {
      setHostId(gameState.hostId)
      const players = gameState.players.map(p => {
        return {
          displayName: p.displayName ? p.displayName : 'Guest',
          uid: p.uid,
        }
      })

      setPlayers(players)
    }
  }, [gameState])

  useEffect(() => {
    if (router) {
      setLoaded(true)
    }
  }, [router])

  return (
    <PageLayout>
      {!gameState?.hasStarted? <div className="flex flex-col justify-between h-full gap-8">
        <div className="grid gap-8">
          <PageTitle>Lobby</PageTitle>
          <LobbyPlayers players={players} hostId={hostId} />
        </div>
        {hostId == user?.uid ? (
          <Button onClick={handleStartGameClick} className=" max-w-md mx-auto">
            START GAME
          </Button>
        ) : (
          <Button
            disabled
            onClick={handleStartGameClick}
            className=" max-w-md mx-auto"
          >
            Waiting for host...
          </Button>
        )}
      </div>: <TestMultiplayer gameState={gameState.game!}/>}
      
    </PageLayout>
  )
}

export default Lobby
