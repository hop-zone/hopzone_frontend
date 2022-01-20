import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { Socket } from 'socket.io-client'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import { useAuth } from './AuthProvider'

export enum SocketMessages {
  activeRooms = 'b2f_gamerooms',
  lobbyInfo = 'b2f_lobby',
  joinLobby = 'f2b_joinLobby',
  leaveLobby = 'f2b_leaveLobby',
  gameState = 'b2f_gameState',
  moveLeft = 'f2b_moveLeft',
  moveRight = 'f2b_moveRight',
  stopMoving = 'f2b_stopMoving',
}

interface ISocketContext {
  activeLobbies: GameRoom[] | undefined
  gameState: GameRoom | undefined
  joinLobby: (lobbyId: string) => Promise<boolean>
  leaveLobby: (lobbyId: string) => Promise<boolean>
  moveLeft: () => Promise<boolean>
  moveRight: () => Promise<boolean>
  stopMoving: () => Promise<boolean>
}

const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const useSockets = () => {
  return useContext(SocketContext)
}

export const SocketProvider: FunctionComponent = ({ children }) => {
  const { socket } = useAuth()
  const [activeLobbies, setActiveLobbies] = useState<GameRoom[]>()
  const [gameState, setGameState] = useState<GameRoom>()

  useEffect(() => {
    if (socket) {
      socket.on(SocketMessages.activeRooms, (data: GameRoom[]) => {
        setActiveLobbies(data)
      })

      socket.on(SocketMessages.gameState, (data: GameRoom) => {
        // console.log(data);
        
        setGameState(data)
      })
    }

    console.log(socket)
  }, [socket])

  const joinLobby = async (lobbyId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit(SocketMessages.joinLobby, lobbyId)
      } else {
        reject
      }
    })
  }

  const leaveLobby = (lobbyId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit(SocketMessages.leaveLobby, lobbyId)
        resolve(true)
      } else {
        reject(false)
      }
    })
  }

  const moveLeft = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      console.log('trying to move')

      if (socket) {
        console.log('moving left')
        socket.emit(SocketMessages.moveLeft)
        resolve(true)
      } else {
        reject(false)
      }
    })
  }
  const moveRight = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit(SocketMessages.moveRight)
        resolve(true)
      } else {
        reject(false)
      }
    })
  }
  const stopMoving = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit(SocketMessages.stopMoving)
        resolve(true)
      } else {
        reject(false)
      }
    })
  }

  const value = {
    activeLobbies: activeLobbies,
    joinLobby,
    leaveLobby,
    gameState,
    moveLeft,
    moveRight,
    stopMoving,
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
