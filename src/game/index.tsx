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

const Sketch = dynamic(() => import('react-p5'), {
  ssr: false,
})

const Game = () => {
  const [gameState, setGameState] = useState({ x: 50, y: 50 })

  let platform: Platform
  let player: Player

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(1280, 720).parent(canvasParentRef)
    p5.rectMode(p5.CENTER)

    platform = new Platform(p5, 640, 700)
    player = new Player(p5, 640, 125)

    console.log(player.intersects(platform))
  }

  const draw = (p5: p5Types) => {
    p5.background(0)
    platform.show()
    player.show()
  }

  const keyPressed = (p5: p5Types) => {}

  return (
    <Sketch
      className="block mx-auto"
      style={{ width: 1280 }}
      setup={setup}
      draw={draw}
      keyPressed={keyPressed}
    />
  )
}

export default Game
