import React, { HTMLAttributes, useEffect, useRef } from 'react'
import PageLayout from 'src/components/layout'
import PageTitle from 'src/components/text/PageTitle'
import Game from 'src/game'
import GameStateProvider from 'src/game/providers/gameStateProvider'
import SinglePlayer from 'src/game/SinglePlayer'

const GameSession = () => {
  return (
    <GameStateProvider>
      <PageLayout>
        <PageTitle>Game</PageTitle>
        <SinglePlayer/>
      </PageLayout>
    </GameStateProvider>
  )
}

export default GameSession
