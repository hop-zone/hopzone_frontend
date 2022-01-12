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
import { useGameState } from './providers/gameStateProvider'

const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

const Game = () => {
  const parentRef = useRef<HTMLDivElement>(null)

  const {state, updateGameState, moveLeft, moveRight, stopMoving} = useGameState();

  
  const [canvasWidth, setCanvasWidth] = useState(1280 - 32)
  const [canvasHeight, setCanvasHeight] = useState(720)
  const [translatedX, setTranslatedX] = useState((canvasWidth/2) + 50)
  const [translatedY, setTranslatedY] = useState(canvasHeight)



  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setCanvasWidth(canvasParentRef.clientWidth - 16)
    p5.createCanvas(canvasParentRef.clientWidth - 16, canvasHeight).parent(
      canvasParentRef,
    )
    p5.rectMode(p5.CENTER)
  }

  const draw = (p5: p5Types) => {
    p5.translate(translatedX, translatedY)
    p5.background(0)
    state?.platforms.forEach(platform => {
      platform.show(p5)
    })

    state?.players.forEach(p => {
      p.show(p5)
    })

    const player = state.players[0]

    let leftBorder = -translatedX
    let rightBorder = canvasWidth - translatedX
    let topBorder = -translatedY
    let bottomBorder = canvasHeight - translatedY

    
    
    if (player.topLeft.x < leftBorder + 100) {
      
      setTranslatedX(-player.topLeft.x + 100) 
    }
    if (player.bottomRight.x > rightBorder - 100) {
      setTranslatedX(-player.bottomRight.x + canvasWidth - 100)
    }
    if (player.topLeft.y < topBorder + 100) {
      setTranslatedY(-player.topLeft.y + 100) 
    }
    if (player.bottomRight.y > bottomBorder) {
      setTranslatedY(-player.bottomRight.y + canvasHeight)
    }

    // setGameState(updateGameState(gameState))
    updateGameState();
  }

  const keyPressed = (p5: p5Types) => {
    switch (p5.keyCode) {
      case p5.RIGHT_ARROW:
        
        moveRight(0)
        break
      case p5.LEFT_ARROW:
        moveLeft(0)
        break
    }
  }

  const keyReleased = (p5: p5Types) => {
    stopMoving(0)
  }

  const windowResized = (p5: p5Types) => {
    if (parentRef != null && parentRef.current) {
      if (parentRef.current.clientWidth < 1280 - 32) {
        setCanvasWidth(parentRef.current.clientWidth)
        p5.resizeCanvas(parentRef.current.clientWidth, canvasHeight)
      } else {
        p5.resizeCanvas(1280 - 32, canvasHeight)
      }
    }
  }


  return (
    <div className=" w-full" ref={parentRef}>
      {parentRef != null ? (
        <Sketch
          className="block mx-auto"
          setup={setup}
          draw={draw}
          keyPressed={keyPressed}
          keyReleased={keyReleased}
          windowResized={windowResized}
        />
      ) : null}
    </div>
  )
}

export default Game
