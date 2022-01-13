import React, { HTMLAttributes, useEffect, useRef } from 'react'
import PageLayout from 'src/components/layout'
import PageTitle from 'src/components/text/PageTitle'
import Game from 'src/game'
import GameStateProvider from 'src/game/providers/gameStateProvider'

const GameSession = () => {
  return (
    <GameStateProvider>
      <PageLayout>
        <PageTitle>Game</PageTitle>
        <Game />
      </PageLayout>
    </GameStateProvider>
  )
}

export default GameSession
