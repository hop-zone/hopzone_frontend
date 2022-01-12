import React, {
  Children,
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GameRoom } from '../interfaces/gameState'
import { Player } from '../models/player'
import { generateLevel } from '../utils/levelGeneration'

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
      players: [player],
      platforms: level,
    })
  }, [])

  const gravity = (player: Player, index: number) => {
    //copy old player data
    let newArray = [...state.players]

    //apply gravity
    const y = player.y + player.ySpeed
    const ySpeed = player.ySpeed + player.gravity

    newArray[index].y = y
    newArray[index].x += newArray[index].xSpeed
    newArray[index].ySpeed = ySpeed

    //listen to player movement input

    setState({ ...state, players: newArray })
  }

  const moveLeft = (index: number) => {
    let newArray = [...state.players]

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

  const updateGameState = () => {
    state.players.forEach((player, index) => {
      gravity(player, index)
      collide(player, index)
      // updateOuterPlayers(player)
    })
  }

  const value = {
    state,
    updateGameState,
    moveLeft,
    moveRight,
    stopMoving
  }

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  )
}

export default GameStateProvider
