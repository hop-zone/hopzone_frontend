import { useRouter } from 'next/router'
import React from 'react'
import Button from 'src/components/forms/Button'
import PageLayout from 'src/components/layout'
import LobbyPlayers from 'src/components/lobby/LobbyPlayers'
import PageTitle from 'src/components/text/PageTitle'
import { Player } from 'src/models/player'

const Lobby = () => {
  const router = useRouter()

  const players: Player[] = [
    { displayName: 'Alexander' },
    { displayName: 'Activitiez' },
    { displayName: 'Activitiez' },
    { displayName: 'Activitiez' },
  ]

  const handleStartGameClick = () => {
      router.push('/gamesession')
  }

  return (
    <PageLayout>
      <div className="flex flex-col justify-between h-full">
        <div className="grid gap-8">
          <PageTitle>Lobby</PageTitle>
          <LobbyPlayers players={players} />
        </div>
        <Button onClick={handleStartGameClick} className=" max-w-md mx-auto">START GAME</Button>
      </div>
    </PageLayout>
  )
}

export default Lobby
