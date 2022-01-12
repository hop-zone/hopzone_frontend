import React, { HTMLAttributes, useEffect, useRef } from 'react'
import PageLayout from 'src/components/layout'
import PageTitle from 'src/components/text/PageTitle'
import Game from 'src/game'

const GameSession = () => {

  return (
    <PageLayout>
     <PageTitle>Game</PageTitle>
      <Game />
    </PageLayout>
  )
}

export default GameSession
