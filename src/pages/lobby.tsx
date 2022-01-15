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
import { User } from 'src/models/serverModels/User'
import { useAuth } from 'src/providers/AuthProvider'
import { SocketMessages, useSockets } from 'src/providers/SocketProvider'

const Lobby = () => {
  const router = useRouter()

  const [loaded, setLoaded] = useState(false)
  useWarnLeaveLobby(router.query.id)

  const { socket, user } = useAuth()
  const { joinLobby, leaveLobby } = useSockets()

  const [hostId, setHostId] = useState('')
  const [players, setPlayers] = useState<User[]>([])

  const handleStartGameClick = () => {
    router.push('/gamesession')
  }

  useEffect(() => {
    let mounted = true
    setLoaded(false)
    if (router.query.id && socket) {
      joinLobby(router.query.id as string)
      socket.on(SocketMessages.lobbyInfo, (data: GameRoom) => {
        setHostId(data.hostId)
        const players = data.players.map(p => {
          return {
            displayName: p.displayName ? p.displayName : 'Guest',
            uid: p.uid,
          }
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
          <LobbyPlayers players={players} hostId={hostId} />
        </div>
        {hostId == user?.uid ? (
          <Button onClick={handleStartGameClick} className=" max-w-md mx-auto">
            START GAME
          </Button>
        ) : (
          <Button disabled onClick={handleStartGameClick} className=" max-w-md mx-auto">
            Waiting for host...
          </Button>
        )}
      </div>
    </PageLayout>
  )
}

export default Lobby
