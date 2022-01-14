import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react'
import { GameRoom } from 'src/models/serverModels/GameRoom'
import { useAuth } from './AuthProvider'

export enum SocketMessages {
  activeRooms = 'b2f_gamerooms',
  lobbyInfo = 'b2f_lobby',
  joinLobby = 'f2b_joinLobby',
  leaveLobby = 'f2b_leaveLobby',
}

interface ISocketContext {
  activeLobbies: GameRoom[] | undefined
  joinLobby: (lobbyId: number) => Promise<boolean>
  leaveLobby: (lobbyId: number) => Promise<boolean>
}

const SocketContext = createContext<ISocketContext>({} as ISocketContext)

export const useSockets = () => {
  return useContext(SocketContext)
}

export const SocketProvider: FunctionComponent = ({ children }) => {
  const { socket } = useAuth()
  const [activeLobbies, setActiveLobbies] = useState<GameRoom[]>()
  const [currentLobby, setCurrentLobby] = useState<GameRoom>()

  useEffect(() => {
    if (socket) {
      socket.on(SocketMessages.activeRooms, (data: GameRoom[]) => {
        setActiveLobbies(data)
      })
    }

    console.log(socket)
  }, [socket])

  const joinLobby = async (lobbyId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit(SocketMessages.joinLobby, lobbyId)
      } else {
        reject
      }
    })
  }

  const leaveLobby = (lobbyId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (socket) {
        socket.emit(SocketMessages.leaveLobby, lobbyId)
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
  }

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  )
}
