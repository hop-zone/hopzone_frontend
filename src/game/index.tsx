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
  const parentRef = useRef<HTMLDivElement>(null)

  const [gameState, setGameState] = useState<GameRoom>({
    players: [],
    platforms: [],
    pressedKeys: { left: false, right: false },
  })

  const [canvasWidth, setCanvasWidth] = useState(1280-32)

  // let canvasWidth = 1280 - 32
  let canvasHeight = 720
  const initialTranslation = canvasWidth / 2
  let translatedX = initialTranslation + 50
  let translatedY = canvasHeight

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setCanvasWidth(canvasParentRef.clientWidth - 16)
    p5.createCanvas(canvasParentRef.clientWidth - 16, canvasHeight).parent(canvasParentRef)

    p5.rectMode(p5.CENTER)
    const player = new Player(p5, 0, -canvasHeight / 2)
    const level = generateLevel(p5)
    setGameState({
      ...gameState,
      players: [player],
      platforms: level,
    })
  }

  const draw = (p5: p5Types) => {
    
    p5.translate(translatedX, translatedY)

    p5.background(0)
    gameState?.platforms.forEach(platform => {
      platform.show()
    })

    gameState?.players.forEach(player => {
      player.show()

      let leftBorder = -translatedX
      let rightBorder = canvasWidth - translatedX
      let topBorder = -translatedY
      let bottomBorder = canvasHeight - translatedY

      if (player.topLeft.x < leftBorder + 100) {
        translatedX = -player.topLeft.x + 100
      }
      if (player.bottomRight.x > rightBorder - 100) {
        translatedX = -player.bottomRight.x + canvasWidth - 100
      }
      if (player.topLeft.y < topBorder + 100) {
        translatedY = -player.topLeft.y + 100
      }
      if (player.bottomRight.y > bottomBorder) {
        translatedY = -player.bottomRight.y + canvasHeight
      }
    })

    setGameState(updateGameState(gameState, p5))
  }

  const keyPressed = (p5: p5Types) => {
    switch (p5.keyCode) {
      case p5.RIGHT_ARROW:
        gameState.pressedKeys.right = true

        break
      case p5.LEFT_ARROW:
        gameState.pressedKeys.left = true
        break
    }
  }

  const keyReleased = (p5: p5Types) => {
    gameState.pressedKeys = { left: false, right: false }
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
