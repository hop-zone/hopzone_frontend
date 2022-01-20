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

interface Fonts {
  regular: p5Types.Font
  semibold: p5Types.Font
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

  const [images, setImages] = useState<p5Types.Image[]>([])
  const [platformImages, setPlatformImages] = useState<p5Types.Image[]>([])
  const [characterImages, setCharacterImages] = useState<p5Types.Image[]>([])
  const [scoreboardImages, setScoreboardImages] = useState<p5Types.Image[]>([])
  const [fonts, setFonts] = useState<Fonts>()

  const preload = (p5: p5Types) => {
    const platformImg = p5.loadImage('/img/platform_static.png')
    const playerImg = p5.loadImage('/img/character.png')
    const backgroundImage = p5.loadImage('/img/bg_texture.png')

    const orangeCharacter = p5.loadImage('/img/character_orange.png')
    const prupleCharacter = p5.loadImage('/img/character_purple.png')
    const greenCharacter = p5.loadImage('/img/character_green.png')
    const blueCharacter = p5.loadImage('/img/character_blue.png')

    const orangeHead = p5.loadImage('/img/head_orange.png')
    const prupleHead = p5.loadImage('/img/head_purple.png')
    const greenHead = p5.loadImage('/img/head_green.png')
    const blueHead = p5.loadImage('/img/head_blue.png')

    const platform_0 = p5.loadImage('/img/platform_0.png')
    const platform_1 = p5.loadImage('/img/platform_1.png')
    const platform_2 = p5.loadImage('/img/platform_2.png')

    const cross = p5.loadImage('/img/cross.png')

    const fontRegular = p5.loadFont('/font/Kanit-Regular.ttf')
    const fontSemibold = p5.loadFont('/font/Kanit-SemiBold.ttf')

    setImages([
      platformImg,
      playerImg,
      backgroundImage,
      cross
    ])
    setCharacterImages([orangeCharacter, prupleCharacter, greenCharacter, blueCharacter])
    setPlatformImages([platform_0, platform_1, platform_2])
    setScoreboardImages([orangeHead, prupleHead, greenHead, blueHead])
    setFonts({ regular: fontRegular, semibold: fontSemibold })
  }
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    setCanvasWidth(canvasParentRef.clientWidth)
    p5.createCanvas(canvasParentRef.clientWidth, canvasHeight).parent(
      canvasParentRef,
    )
    p5.rectMode(p5.CENTER)
    p5.imageMode(p5.CENTER)
    p5.textFont(fonts!.regular as object)
  }

  const draw = (p5: p5Types) => {
    const players = gameState.players.map(p => {
      return new Player(
        p.x,
        p.y,
        p.uid,
        p.playerNum,
        p.displayName,
        p.highestPosition,
        p.xSpeed,
      )
    })

    const deadPlayers = gameState.deadPlayers.map(p => {
      return new Player(
        p.x,
        p.y,
        p.uid,
        p.playerNum,
        p.displayName,
        p.highestPosition,
        p.xSpeed,
      )
    })

    const platforms = gameState.platforms.map(p => {
      return new Platform(p.x, p.y, p.platformType)
    })

    const player = players.find(p => {
      return p.uid == user?.uid
    })

    p5.push()
    p5.translate(translatedX / 10, translatedY / 10)

    p5.imageMode(p5.CENTER)
    const imageSize = 1500
    for (let i = -1; i < 2; i++) {
      for (let j = 0; j < 3; j++) {
        p5.image(images[2], i * imageSize, j * -imageSize, imageSize, imageSize)
      }
    }
    p5.pop()

    p5.push()
    p5.translate(translatedX, translatedY)
    platforms.forEach(platform => {
      platform.show(p5, platformImages[platform.platformType])
    })

    players.forEach((p, i) => {
      p.show(p5, characterImages[p.playerNum])
    })

    let leftBorder = -translatedX
    let rightBorder = canvasWidth - translatedX
    let topBorder = -translatedY
    let bottomBorder = canvasHeight - translatedY

    if (player) {
      player.showBarrier(p5)
      if (player.topLeft.x < leftBorder + 100) {
        setTranslatedX(-player.topLeft.x + 100)
      }
      if (player.bottomRight.x > rightBorder - 100) {
        setTranslatedX(-player.bottomRight.x + canvasWidth - 100)
      }
      if (player.topLeft.y < topBorder + 100) {
        setTranslatedY(-player.topLeft.y + 100)
      }
      if (player.bottomRight.y > bottomBorder - 100) {
        setTranslatedY(-player.bottomRight.y - 100 + canvasHeight)
      }
    }

    p5.pop()
    showScoreBoard(p5, players, deadPlayers)
  }

  const showScoreBoard = (p5: p5Types, alivePlayers: Player[], deadPlayers: Player[]) => {
    p5.push()
    p5.translate(20, 20)

    const sorted = alivePlayers.sort((a, b) => {
      const score1 = Math.round(Math.abs(a.highestPosition))
      const score2 = Math.round(Math.abs(b.highestPosition))

      if (score1 < score2) {
        return 1
      }
      if (score1 > score2) {
        return -1
      }
      return 0
    })
    sorted.map((p, i) => {
      const img = scoreboardImages[i]
      p5.push()
      p5.scale(0.8)
      if(i == 0) {
        p5.scale(1.2)
      }
      p5.translate(0, i * 100)
      p5.imageMode(p5.CORNER)
      p5.image(scoreboardImages[p.playerNum], 0, 0)
      p5.fill(255)
      p5.textSize(16)
      p5.text(p.displayName, img.width + 10, img.height - 10)
      p5.textSize(24)
      p5.textFont(fonts?.semibold as object)
      p5.text(Math.round(Math.abs(p.highestPosition)), img.width + 10, img.height / 2)
      p5.pop()
    })
    p5.pop()

    p5.push()
    p5.translate(20, canvasHeight - 20)

    deadPlayers.map((p, i) =>{
      p5.push()
      p5.scale(0.8)
      p5.translate(0, i * -70)
      p5.imageMode(p5.CORNER)
      p5.image(scoreboardImages[p.playerNum], 0, -scoreboardImages[p.playerNum].height)
      p5.image(images[3], 0, -scoreboardImages[p.playerNum].height)
      p5.pop()
    })

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
          preload={preload}
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
