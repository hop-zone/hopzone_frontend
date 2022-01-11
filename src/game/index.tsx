import React, {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import p5Types from 'p5'
import dynamic from 'next/dynamic'
import { Platform } from './models/platform'
import { Player } from './models/player'
import { GameRoom } from './interfaces/gameState'
import { generateLevel } from './utils/levelGeneration'
import { updateGameState } from './utils/gameStateUpdater'

const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

const Game = () => {
  
    let gameState: GameRoom;


  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(1280, 720).parent(canvasParentRef)
    p5.rectMode(p5.CENTER)

    const player = new Player(p5, 640, 125)
    const level = generateLevel(p5)
    gameState = {players: [player], platforms: level, pressedKeys: {left: false, right: false}}

    console.log(level);
    
  }

  

  const draw = (p5: p5Types) => {
    p5.background(0)
    gameState?.platforms.forEach(platform => {
        platform.show()
    });

    gameState?.players.forEach(player => {
        player.show()
    })

    gameState = updateGameState(gameState);
    
  }

  const keyPressed = (p5: p5Types) => {
    switch(p5.keyCode){
        case p5.RIGHT_ARROW:
            console.log("right pressed");
            
            gameState.pressedKeys.right = true

            console.log(gameState.pressedKeys);
            
            break;
        case p5.LEFT_ARROW:
            gameState.pressedKeys.left = true
            break;
    }
  }

  const keyReleased = (p5: p5Types) => {
      gameState.pressedKeys = {left: false, right: false}
      console.log(gameState.pressedKeys);
      
  }


  return (
    <Sketch
      className="block mx-auto"
      style={{ width: 1280 }}
      setup={setup}
      draw={draw}
      keyPressed={keyPressed}
      keyReleased={keyReleased}
    />
  )
}

export default Game
