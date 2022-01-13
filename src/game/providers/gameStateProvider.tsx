import { platform } from 'os'
import React, {
  Children,
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GameRoom } from '../interfaces/gameState'
import { Platform } from '../models/platform'
import { Player } from '../models/player'
import { generateLevel } from '../utils/levelGeneration'
import { getRandomInt } from '../utils/random'

interface IGameStateContext {
  state: GameRoom
  updateGameState: () => void
  moveLeft: (index: number) => void
  moveRight: (index: number) => void
  stopMoving: (index: number) => void
}

const GameStateContext = createContext<IGameStateContext>(
  {} as IGameStateContext,
)

export function useGameState() {
  return useContext(GameStateContext)
}

const GameStateProvider: FunctionComponent = ({ children }) => {
  const worldWidth = 2000
  const [state, setState] = useState<GameRoom>({
    players: [],
    platforms: [],
    pressedKeys: { left: false, right: false },
  })

  useEffect(() => {
    const player = new Player(0, -400)
    const player2 = new Player(150, -400)
    const level = generateLevel()

    setState({
      ...state,
      players: [player, player2],
      platforms: level,
    })
  }, [])

  const gravity = (player: Player, index: number) => {
    //copy old player data
    let newArray = [...state.players]

    //apply gravity
    const y = player.y + player.ySpeed
    const ySpeed = player.ySpeed + player.gravity

    const xBeforeUpdate = player.x
    newArray[index].x += newArray[index].xSpeed

    //constrain player to world bounds
    if (player.topLeft.x < -worldWidth / 2) {
      newArray[index].x = xBeforeUpdate
    } else if (player.bottomRight.x > worldWidth / 2) {
      newArray[index].x = xBeforeUpdate
    }

    newArray[index].y = y

    newArray[index].ySpeed = ySpeed

    //listen to player movement input
    setState({ ...state, players: newArray })
  }

  const moveLeft = (index: number) => {
    let newArray = [...state.players]

    // console.log(worldWidth);

    newArray[index].xSpeed = -newArray[index].movementSpeed

    setState({ ...state, players: newArray })
  }

  const stopMoving = (index: number) => {
    let newArray = [...state.players]

    newArray[index].xSpeed = 0

    setState({ ...state, players: newArray })
  }

  const moveRight = (index: number) => {
    let newArray = [...state.players]

    newArray[index].xSpeed = newArray[index].movementSpeed

    setState({ ...state, players: newArray })
  }

  const collide = (player: Player, index: number) => {
    state.platforms.forEach(platform => {
      if (player.intersects(platform) && player.ySpeed > 0) {
        let newArray = [...state.players]
        newArray[index].ySpeed = -player.maxSpeed

        setState({ ...state, players: newArray })
      }
    })
  }

  const generatePlatforms = () => {
    const highestPlayer = Math.min.apply(
      Math,
      state.players.map(function (o) {
        return o.y
      }),
    )
    const highestPlatform = Math.min.apply(
      Math,
      state.platforms.map(function (o) {
        return o.y
      }),
    )
    const lowestPlayer = Math.max.apply(
      Math,
      state.players.map(function (o) {
        return o.y
      }),
    )
    const lowestPlatform = Math.max.apply(
      Math,
      state.platforms.map(function (o) {
        return o.y
      }),
    )

    let copyOfPlatforms = [...state.platforms]

    if (highestPlayer < highestPlatform + 100) {
      for (let i = 0; i < 4; i++) {
        const newPlatform: Platform = new Platform(
          getRandomInt(-1000, 1000),
          getRandomInt(highestPlatform, highestPlatform - 100),
        )
        copyOfPlatforms.push(newPlatform)
      }
    }

    if (lowestPlayer < lowestPlatform - 1000) {
      copyOfPlatforms = copyOfPlatforms.filter((p: Platform) => {
        return p.y != lowestPlatform
      })
    }

    setState({ ...state, platforms: copyOfPlatforms })
  }

  const updateGameState = () => {
    state.players.forEach((player, index) => {
      gravity(player, index)
      collide(player, index)
      //   updateOuterPlayers(player, index)
    })
    generatePlatforms()
  }

  const value = {
    state,
    updateGameState,
    moveLeft,
    moveRight,
    stopMoving,
  }

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export default GameStateProvider
