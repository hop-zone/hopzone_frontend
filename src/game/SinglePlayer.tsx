import React, { useEffect } from 'react'
import { useGameState } from './providers/gameStateProvider'
import TestMultiplayer from './testMultiplayer'

const SinglePlayer = () => {
  const { state, moveLeft, moveRight, stopMoving, createGame } = useGameState()

  useEffect(() => {
    createGame()
  }, [])

  useEffect(() => {
    console.log(state);
    
  }, [state]);
  

  return (
    <div>
      {state ? (
        <TestMultiplayer
          gameState={state}
          moveLeft={moveLeft}
          moveRight={moveRight}
          stopMoving={stopMoving}
          isSinglePlayer={true}
        />
      ) : null}
    </div>
  )
}

export default SinglePlayer
