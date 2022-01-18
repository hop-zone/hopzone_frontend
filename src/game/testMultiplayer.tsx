import React, {
  FunctionComponent,
  LegacyRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import p5Types from 'p5'
import dynamic from 'next/dynamic'
import { useGameState } from './providers/gameStateProvider'
import { useSockets } from 'src/providers/SocketProvider'
import { Game } from 'src/models/serverModels/Game'
import { Player } from './models/player'
import { Platform } from './models/platform'
import { useAuth } from 'src/providers/AuthProvider'

const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

interface MultiplayerProps {
  gameState: Game
}

const TestMultiplayer: FunctionComponent<MultiplayerProps> = ({
  gameState,
}) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const { moveLeft, moveRight, stopMoving } = useSockets()
  const { user } = useAuth()

  const [canvasWidth, setCanvasWidth] = useState(1280 - 32)
  const [canvasHeight, setCanvasHeight] = useState(720)
  const [translatedX, setTranslatedX] = useState(canvasWidth / 2 + 50)
  const [translatedY, setTranslatedY] = useState(canvasHeight)

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setCanvasWidth(canvasParentRef.clientWidth)
    p5.createCanvas(canvasParentRef.clientWidth, canvasHeight).parent(
      canvasParentRef,
    )
    p5.rectMode(p5.CENTER)
  }

  const draw = (p5: p5Types) => {
    const players = gameState.players.map(p => {
      return new Player(p.x, p.y, p.uid)
    })

    const platforms = gameState.platforms.map(p => {
      return new Platform(p.x, p.y)
    })

    p5.translate(translatedX, translatedY)
    p5.background(0)
    platforms.forEach(platform => {
      platform.show(p5)
    })

    players.forEach(p => {
      p.show(p5)
    })

    const player = players.find(p => {
      return p.uid == user?.uid
    })

    let leftBorder = -translatedX
    let rightBorder = canvasWidth - translatedX
    let topBorder = -translatedY
    let bottomBorder = canvasHeight - translatedY

    if (player) {
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
    }
  }

  const keyPressed = (p5: p5Types) => {
    switch (p5.keyCode) {
      case p5.RIGHT_ARROW:
        moveRight()
        break
      case p5.LEFT_ARROW:
        moveLeft()
        break
    }
  }

  const keyReleased = (p5: p5Types) => {
    stopMoving()
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

export default TestMultiplayer
